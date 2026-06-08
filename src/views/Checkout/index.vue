<script setup>
import { getCheckInfoAPI, addAddressAPI } from '@/apis/checkout' // 移除 createOrderAPI
import { useRouter } from 'vue-router'
import { reactive, ref, onMounted, computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
const router = useRouter()
const cartGoods = computed(() => cartStore.cartList.filter(item => item.selected !== false))
const summary = computed(() => {
  const goods = cartGoods.value
  const goodsCount = goods.reduce((sum, item) => sum + (item.count || 0), 0)
  const totalPrice = goods.reduce((sum, item) => sum + ((item.price || 0) * (item.count || 0)), 0)
  return {
    goodsCount,
    totalPrice,
    postFee: 0,
    totalPayPrice: totalPrice
  }
})

const checkInfo = ref({
  userAddresses: []
})
const curAddress = ref({})
const activeAddress = ref({})
const showDialog = ref(false)
const addFlag = ref(false)
const newAddress = reactive({
  receiver: '',
  contact: '',
  region: [],
  province: '',
  city: '',
  county: '',
  address: '',
  isDefault: false
})
const addressFormRef = ref(null)
const regionOptions = [
  {
    value: '广东省',
    label: '广东省',
    children: [
      {
        value: '广州市',
        label: '广州市',
        children: [
          { value: '海珠区', label: '海珠区' },
          { value: '天河区', label: '天河区' },
          { value: '越秀区', label: '越秀区' }
        ]
      },
      {
        value: '深圳市',
        label: '深圳市',
        children: [
          { value: '福田区', label: '福田区' },
          { value: '南山区', label: '南山区' }
        ]
      }
    ]
  },
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '北京市',
        label: '北京市',
        children: [
          { value: '朝阳区', label: '朝阳区' },
          { value: '海淀区', label: '海淀区' }
        ]
      }
    ]
  }
]
const addressRules = {
  receiver: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  region: [
    {
      validator: (rule, value) => {
        return Array.isArray(value) && value.length === 3
          ? Promise.resolve()
          : Promise.reject(new Error('请选择省市区'))
      },
      trigger: 'change'
    }
  ],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

const getCheckoutInfo = async () => {
  const res = await getCheckInfoAPI()
  const data = res.result || {}

  checkInfo.value.userAddresses = data.userAddresses || []
  const item = checkInfo.value.userAddresses.find(item => item.isDefault === 0) || checkInfo.value.userAddresses[0] || {}
  curAddress.value = item
  activeAddress.value = item
}

const openAddressDialog = () => {
  activeAddress.value = curAddress.value.id
    ? curAddress.value
    : checkInfo.value.userAddresses[0] || {}
  showDialog.value = true
}

const switchAddress = (item) => {
  activeAddress.value = item
}

const confirm = () => {
  curAddress.value = activeAddress.value
  showDialog.value = false
}

const resetNewAddress = () => {
  newAddress.receiver = ''
  newAddress.contact = ''
  newAddress.region = []
  newAddress.province = ''
  newAddress.city = ''
  newAddress.county = ''
  newAddress.address = ''
  newAddress.isDefault = false
}

const openAddAddressDialog = () => {
  resetNewAddress()
  addFlag.value = true
}

const submitNewAddress = async () => {
  if (!addressFormRef.value) return
  // trim inputs to avoid invisible whitespace
  newAddress.receiver = (newAddress.receiver || '').trim()
  newAddress.contact = (newAddress.contact || '').trim()
  newAddress.address = (newAddress.address || '').trim()

  const [province, city, county] = newAddress.region || []
  newAddress.province = province || ''
  newAddress.city = city || ''
  newAddress.county = county || ''

  try {
    console.log('submitNewAddress payload before validate:', JSON.parse(JSON.stringify(newAddress)))
    await addressFormRef.value.validate()

    const res = await addAddressAPI({
      receiver: newAddress.receiver,
      contact: newAddress.contact,
      province: newAddress.province,
      city: newAddress.city,
      county: newAddress.county,
      address: newAddress.address,
      isDefault: newAddress.isDefault ? 0 : 1
    })

    addFlag.value = false
    const saved = res.result || {}
    const newItem = {
      id: saved.id || `${Date.now()}_${Math.random()}`,
      receiver: newAddress.receiver,
      contact: newAddress.contact,
      fullLocation: `${province}/${city}/${county}`,
      address: newAddress.address,
      isDefault: newAddress.isDefault ? 0 : 1,
      ...saved
    }

    if (newAddress.isDefault) {
      checkInfo.value.userAddresses.forEach(item => {
        item.isDefault = 1
      })
      curAddress.value = newItem
    }

    checkInfo.value.userAddresses.unshift(newItem)
    activeAddress.value = newItem
    resetNewAddress()
    await getCheckoutInfo()
  } catch (err) {
    console.warn('submitNewAddress error', err)
  }
}

const closeAddDialog = () => {
  addFlag.value = false
  resetNewAddress()
}

onMounted(() => {
  getCheckoutInfo()
})

// 提交订单：直接跳转到支付页面，并清空购物车中已选中的商品
const createOrder = () => {
  // 清空购物车中所有选中的商品（selected === true 的商品）
  cartStore.cartList = cartStore.cartList.filter(item => item.selected !== true)

  // 生成临时订单ID（用于支付页面参数）
  const mockOrderId = Date.now().toString()
  router.push({
    path: '/pay',
    query: {
      id: mockOrderId
    }
  })
}
</script>

<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <div class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address">
            <div class="text">
              <div class="none" v-if="!curAddress.receiver">您需要先添加收货地址才可提交订单。</div>
              <ul v-else>
                <li>
                  <span>
                    收
                    <i />
                    货
                    <i />
                    人：
                  </span>
                  {{ curAddress.receiver }}
                </li>
                <li>
                  <span>联系方式：</span>
                  {{ curAddress.contact }}
                </li>
                <li>
                  <span>收货地址：</span>
                  {{ curAddress.fullLocation }} {{ curAddress.address }}
                </li>
              </ul>
            </div>
            <div class="action">
              <el-button size="large" @click="openAddressDialog()">切换地址</el-button>
              <el-button size="large" @click="openAddAddressDialog()">添加地址</el-button>
            </div>
          </div>
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in cartGoods" :key="i.skuId">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="i.picture" alt="" />
                    <div class="right">
                      <p>{{ i.name }}</p>
                      <p>{{ i.attrsText || '' }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ i.price }}</td>
                <td>{{ i.count }}</td>
                <td>&yen;{{ (i.price * i.count).toFixed(2) }}</td>
                <td>&yen;{{ (i.price * i.count).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color: #999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ summary.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ summary.totalPrice.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>
                运
                <i></i>
                费：
              </dt>
              <dd>¥{{ summary.postFee.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">{{ summary.totalPayPrice.toFixed(2) }}</dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <el-button type="primary" size="large" @click="createOrder">提交订单</el-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 切换地址 -->
  <el-dialog v-model="showDialog" title="切换收货地址" width="30%" center>
    <div class="addressWrapper">
      <div
        class="text item"
        :class="{ active: activeAddress.id === item.id }"
        v-for="item in checkInfo.userAddresses"
        :key="item.id"
        @click="switchAddress(item)"
      >
        <ul>
          <li>
            <span>
              收
              <i />
              货
              <i />
              人：
            </span>
            {{ item.receiver }}
          </li>
          <li>
            <span>联系方式：</span>
            {{ item.contact }}
          </li>
          <li>
            <span>收货地址：</span>
            {{ item.fullLocation + item.address }}
          </li>
        </ul>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 添加地址 -->
  <el-dialog v-model="addFlag" title="添加收货地址" width="30%" center @close="resetNewAddress">
    <el-form ref="addressFormRef" :model="newAddress" :rules="addressRules" label-width="90px">
      <el-form-item label="收货人" prop="receiver">
        <el-input v-model="newAddress.receiver" placeholder="请输入收货人姓名" />
      </el-form-item>
      <el-form-item label="联系方式" prop="contact">
        <el-input v-model="newAddress.contact" placeholder="请输入联系方式" />
      </el-form-item>
      <el-form-item label="省市区" prop="region">
        <el-cascader
          v-model="newAddress.region"
          :options="regionOptions"
          placeholder="请选择省市区"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="newAddress.address" placeholder="请输入详细地址" />
      </el-form-item>
      <el-form-item label="设为默认">
        <el-switch v-model="newAddress.isDefault" active-text="默认地址" inactive-text="普通地址" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeAddDialog()">取消</el-button>
        <el-button type="primary" @click="submitNewAddress">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.xtx-pay-checkout-page {
  margin-top: 20px;

  .wrapper {
    background: #fff;
    padding: 0 20px;

    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }

    .box-body {
      padding: 20px 0;
    }
  }
}

.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    > ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    > a {
      color: $xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  .info {
    display: flex;
    text-align: left;

    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }

    .right {
      line-height: 24px;

      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }

  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }

    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;

      &:first-child {
        border-left: 1px solid #f5f5f5;
      }

      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}

.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;

  &.active,
  &:hover {
    border-color: $xtxColor;
  }
}

.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;

    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }

    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;

      &.price {
        font-size: 20px;
        color: $priceColor;
      }
    }
  }
}

.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}

.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
}

.text {
  flex: 1;
  min-height: 90px;
  display: flex;
  align-items: center;

  &.item {
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    cursor: pointer;

    &.active,
    &:hover {
      border-color: $xtxColor;
      background: lighten($xtxColor, 50%);
    }

    > ul {
      padding: 10px;
      font-size: 14px;
      line-height: 30px;
    }
  }
}
</style>
