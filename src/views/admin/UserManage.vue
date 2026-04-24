<template>
  <el-card shadow="never">
    <!-- 顶部工具栏 -->
    <template #header>
      <div class="card-header">
        <span class="title">用户管理</span>
        <div class="header-right">
          <el-input
              v-model="keyword"
              placeholder="搜索用户名/姓名"
              clearable
              @clear="loadData"
              @keyup.enter="loadData"
              style="width: 200px; margin-right: 10px"
          />
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button type="success" @click="openDialog()">新增用户</el-button>
        </div>
      </div>
    </template>

    <!-- 数据表格 -->
    <el-table :data="tableData" v-loading="loading" border stripe row-key="id">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="username" label="用户名" min-width="120" />
      <el-table-column prop="realName" label="真实姓名" min-width="120" />
      <el-table-column prop="phone" label="联系电话" min-width="130" />

      <!-- 角色列 -->
      <el-table-column prop="role" label="角色" width="100" align="center">
        <template #default="{row}">
          <el-tag :type="row.role === 'ADMIN' ? 'danger' : row.role === 'STAFF' ? 'warning' : 'success'">
            {{ roleMap[row.role] || row.role }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 👇 修正：楼栋和房间号是独立列，放在外面 -->
      <el-table-column prop="buildingName" label="所属楼栋" min-width="120" align="center">
        <template #default="{row}">{{ row.buildingName || '-' }}</template>
      </el-table-column>
      <el-table-column prop="roomNo" label="房间号" width="100" align="center">
        <template #default="{row}">{{ row.roomNo || '-' }}</template>
      </el-table-column>

      <!-- 状态列 -->
      <el-table-column label="状态" width="100" align="center">
        <template #default="{row}">
          <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="toggleStatus(row)"
              :disabled="row.id === 1"
          />
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" width="160" align="center" fixed="right">
        <template #default="{row}">
          <el-button link type="primary" @click="openDialog(row)">编辑</el-button>
          <el-popconfirm title="确定删除该用户?" @confirm="handleDelete(row.id)">
            <template #reference>
              <el-button link type="danger" :disabled="row.id === 1">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-box">
      <el-pagination
          v-model:current-page="page.current"
          v-model:page-size="page.size"
          :total="page.total"
          layout="total, prev, pager, next"
          @current-change="loadData"
      />
    </div>
  </el-card>

  <!-- 新增/编辑弹窗 -->
  <el-dialog v-model="dialogVisible" :title="form.id ? '编辑用户' : '新增用户'" width="550px" destroy-on-close>
    <el-form :model="form" label-width="80px" :rules="rules" ref="formRef">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" :disabled="!!form.id" placeholder="登录账号" />
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="form.realName" placeholder="真实姓名" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" placeholder="联系电话" />
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!form.id">
        <el-input v-model="form.password" type="password" placeholder="留空默认 123456" show-password />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" style="width: 100%">
          <el-option label="管理员" value="ADMIN" />
          <el-option label="工作人员" value="STAFF" />
          <el-option label="业主" value="OWNER" />
        </el-select>
      </el-form-item>

      <!-- 房屋绑定级联选择器 -->
      <el-form-item label="绑定房屋" v-if="form.role === 'OWNER'">
        <el-cascader
            v-model="cascaderValue"
            :options="houseTree"
            :props="{ value: 'id', label: 'name', children: 'children', checkStrictly: false, emitPath: false }"
            placeholder="选择 楼栋 / 单元 / 房间"
            clearable
            style="width: 100%"
            @change="onHouseChange"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

// === 数据定义 ===
const roleMap = { ADMIN: '管理员', STAFF: '员工', OWNER: '业主' }
const keyword = ref('')
const loading = ref(false)
const tableData = ref([])
const page = reactive({ current: 1, size: 10, total: 0 })
const dialogVisible = ref(false)
const formRef = ref(null)
const houseTree = ref([])
const cascaderValue = ref(null)

const form = reactive({
  id: null,
  username: '',
  realName: '',
  phone: '',
  role: 'OWNER',
  password: '',
  houseId: null
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

// === 核心逻辑 ===

// 1. 加载列表
const loadData = async () => {
  loading.value = true
  try {
    const res = await request.get('/users/page', {
      params: { ...page, keyword: keyword.value }
    })
    tableData.value = res.data.records
    page.total = res.data.total
  } finally {
    loading.value = false
  }
}

// 2. 打开弹窗 & 加载房屋树
const openDialog = async (row = null) => {
  if (row) {
    // 编辑模式：回显数据
    Object.assign(form, row)
    form.password = '' // 编辑时不显示密码
    // 如果该用户绑定了房屋，回显级联值
    if (row.houseId) {
      cascaderValue.value = row.houseId
      // 需要确保级联树加载完毕后再赋值（通过 loadHouseTree 内部逻辑处理，或简单延迟）
    } else {
      cascaderValue.value = null
    }
  } else {
    // 新增模式：重置表单
    Object.assign(form, { id: null, username: '', realName: '', phone: '', role: 'OWNER', password: '', houseId: null })
    cascaderValue.value = null
  }

  // 加载楼栋/房屋数据
  await loadHouseTree()

  // 如果是编辑且有 houseId，再次尝试赋值（确保树加载后能匹配）
  if (row && row.houseId) {
    cascaderValue.value = row.houseId
  }

  dialogVisible.value = true
}

// 加载级联数据
const loadHouseTree = async () => {
  const bRes = await request.get('/users/buildings')
  const tree = []
  // 并行获取所有楼栋下的房屋（实际项目可能做成懒加载，这里一次性加载方便）
  for (const b of bRes.data) {
    try {
      const hRes = await request.get('/users/houses', { params: { buildingId: b.id } })
      tree.push({
        id: b.id,
        name: b.name,
        children: hRes.data.map(h => ({ id: h.id, name: h.roomNo, isLeaf: true }))
      })
    } catch (e) { console.error(e) }
  }
  houseTree.value = tree
}

// 级联选择器变更
const onHouseChange = (val) => {
  form.houseId = val
}

// 3. 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      if (form.id) {
        await request.put(`/users/${form.id}`, form)
      } else {
        await request.post('/users', form)
      }
      dialogVisible.value = false
      ElMessage.success('操作成功')
      loadData()
    } catch (e) {
      // 错误已在 request.js 拦截
    }
  })
}

// 4. 删除
const handleDelete = async (id) => {
  await request.delete(`/users/${id}`)
  ElMessage.success('删除成功')
  loadData()
}

// 5. 切换状态
const toggleStatus = async (row) => {
  try {
    await request.put(`/users/status/${row.id}?status=${row.status}`)
    ElMessage.success('状态更新成功')
  } catch (e) {
    // 失败回滚状态
    row.status = row.status === 1 ? 0 : 1
  }
}

onMounted(loadData)
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.title { font-weight: bold; font-size: 16px; }
.pagination-box { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>
