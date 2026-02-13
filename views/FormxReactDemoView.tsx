import React, { useState, useMemo } from 'react';
import { 
  LayoutGrid, Eye, FileCode, Package, 
  Calculator, ShoppingBag, Layers, Sparkles, 
  Code, Palette, Star, Calendar, Sliders, ToggleLeft, FileText,
  Type, Hash, Check, List, GitBranch, Droplet, Upload, Lock,
  Zap, Percent, DollarSign, TrendingUp, Receipt, PiggyBank,
  ChevronDown, ChevronRight
} from 'lucide-react';
import { 
  FormProvider, 
  FormField, 
  useFormEngine
} from '@enginx/formx-react';
import type { FieldSchema } from '@enginx/formx-core';

interface FieldTypeInfo {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  schemaExample: string;
  usageTips: string[];
}

const fieldTypeInfos: FieldTypeInfo[] = [
  {
    type: 'TEXT',
    label: '文本输入',
    icon: <Type className="w-5 h-5" />,
    description: '单行文本输入框，适用于短文本内容如姓名、标题、编码等。',
    features: [
      '支持占位符文本 (placeholder)',
      '支持最大长度限制',
      '支持正则表达式验证',
      '支持前后缀插槽'
    ],
    schemaExample: `{
  key: 'username',
  type: 'TEXT',
  label: '用户名',
  span: 6,
  ui: {
    placeholder: '请输入用户名',
    description: '4-20个字符'
  },
  slot: {
    prefix: '@',
    suffix: '.com'
  }
}`,
    usageTips: [
      '使用 span 控制字段宽度 (1-12)',
      'ui.placeholder 设置输入提示',
      'ui.description 显示字段说明'
    ]
  },
  {
    type: 'TEXTAREA',
    label: '多行文本',
    icon: <FileText className="w-5 h-5" />,
    description: '多行文本输入框，适用于长文本内容如描述、备注、文章等。',
    features: [
      '支持设置行数 (rows)',
      '支持自动高度调整',
      '支持字符计数',
      '支持最大长度限制'
    ],
    schemaExample: `{
  key: 'description',
  type: 'TEXTAREA',
  label: '详细描述',
  span: 12,
  rows: 4,
  ui: {
    placeholder: '请输入详细描述...',
    description: '最多500字'
  }
}`,
    usageTips: [
      'rows 控制默认显示行数',
      '适合收集大段文本内容',
      '建议设置最大字符限制'
    ]
  },
  {
    type: 'NUMBER',
    label: '数字输入',
    icon: <Hash className="w-5 h-5" />,
    description: '数字输入框，支持整数和小数输入，可设置范围和步进值。',
    features: [
      '支持最小/最大值限制',
      '支持步进值设置',
      '支持整数/小数模式',
      '支持千分位格式化'
    ],
    schemaExample: `{
  key: 'age',
  type: 'NUMBER',
  label: '年龄',
  span: 4,
  min: 0,
  max: 150,
  step: 1,
  ui: {
    placeholder: '请输入年龄'
  }
}`,
    usageTips: [
      'min/max 设置数值范围',
      'step 设置增减步长',
      '可配合表达式实现计算'
    ]
  },
  {
    type: 'MONETARY',
    label: '货币金额',
    icon: <ShoppingBag className="w-5 h-5" />,
    description: '货币金额输入框，自动格式化显示，支持多种货币符号。',
    features: [
      '自动千分位格式化',
      '支持自定义货币符号',
      '支持前缀/后缀显示',
      '支持精度设置'
    ],
    schemaExample: `{
  key: 'price',
  type: 'MONETARY',
  label: '商品价格',
  span: 6,
  prefix: '¥',
  suffix: '元',
  ui: {
    description: '请输入商品售价'
  }
}`,
    usageTips: [
      'prefix 设置货币符号',
      'suffix 设置单位文字',
      '自动处理小数点位数'
    ]
  },
  {
    type: 'SLIDER',
    label: '滑块选择',
    icon: <Sliders className="w-5 h-5" />,
    description: '滑块选择器，适用于在一定范围内选择数值，如音量、亮度等。',
    features: [
      '支持最小/最大值范围',
      '支持步进值设置',
      '支持显示当前值',
      '支持范围选择模式'
    ],
    schemaExample: `{
  key: 'volume',
  type: 'SLIDER',
  label: '音量',
  span: 6,
  min: 0,
  max: 100,
  step: 5,
  showValue: true
}`,
    usageTips: [
      '适合需要直观调节的场景',
      'step 设置滑动步长',
      'showValue 显示当前数值'
    ]
  },
  {
    type: 'BOOLEAN',
    label: '复选框',
    icon: <Check className="w-5 h-5" />,
    description: '复选框组件，用于表示是/否、同意/不同意等二元选择。',
    features: [
      '支持默认选中状态',
      '支持禁用状态',
      '支持自定义标签文字',
      '支持只读模式'
    ],
    schemaExample: `{
  key: 'agree',
  type: 'BOOLEAN',
  label: '同意用户协议',
  span: 12,
  ui: {
    description: '请阅读并同意协议条款'
  }
}`,
    usageTips: [
      '适合单一选项确认',
      '常用于协议勾选',
      '可设置默认值 true/false'
    ]
  },
  {
    type: 'SWITCH',
    label: '开关切换',
    icon: <ToggleLeft className="w-5 h-5" />,
    description: '开关切换组件，提供更直观的开关状态切换体验。',
    features: [
      '开关样式更直观',
      '支持禁用状态',
      '支持自定义颜色',
      '支持加载状态'
    ],
    schemaExample: `{
  key: 'enabled',
  type: 'SWITCH',
  label: '启用功能',
  span: 6,
  ui: {
    description: '开启后功能将生效'
  }
}`,
    usageTips: [
      '适合功能开关场景',
      '视觉效果比复选框更明显',
      '推荐用于设置类表单'
    ]
  },
  {
    type: 'ENUM',
    label: '下拉选择',
    icon: <List className="w-5 h-5" />,
    description: '下拉选择框，适用于从多个选项中选择一个值的场景。',
    features: [
      '支持单选模式',
      '支持选项分组',
      '支持搜索筛选',
      '支持自定义渲染'
    ],
    schemaExample: `{
  key: 'status',
  type: 'ENUM',
  label: '状态',
  span: 4,
  options: [
    { value: 'active', label: '激活' },
    { value: 'inactive', label: '停用' },
    { value: 'pending', label: '待审核' }
  ]
}`,
    usageTips: [
      'options 定义选项列表',
      'value 为选项值，label 为显示文本',
      '选项较多时推荐使用'
    ]
  },
  {
    type: 'RADIO',
    label: '单选按钮',
    icon: <Layers className="w-5 h-5" />,
    description: '单选按钮组，所有选项平铺展示，适合选项较少的场景。',
    features: [
      '选项平铺展示',
      '支持水平/垂直布局',
      '支持禁用单个选项',
      '支持自定义样式'
    ],
    schemaExample: `{
  key: 'gender',
  type: 'RADIO',
  label: '性别',
  span: 6,
  direction: 'horizontal',
  options: [
    { value: 'male', label: '男' },
    { value: 'female', label: '女' },
    { value: 'other', label: '其他' }
  ]
}`,
    usageTips: [
      'direction 设置排列方向',
      '选项少于5个时推荐使用',
      '用户可直观看到所有选项'
    ]
  },
  {
    type: 'CHECKBOX',
    label: '多选框组',
    icon: <Check className="w-5 h-5" />,
    description: '多选框组，允许用户从多个选项中选择多个值。',
    features: [
      '支持多选模式',
      '支持水平/垂直布局',
      '支持全选功能',
      '支持最大选择数限制'
    ],
    schemaExample: `{
  key: 'hobbies',
  type: 'CHECKBOX',
  label: '兴趣爱好',
  span: 6,
  options: [
    { value: 'reading', label: '阅读' },
    { value: 'sports', label: '运动' },
    { value: 'music', label: '音乐' },
    { value: 'travel', label: '旅行' }
  ]
}`,
    usageTips: [
      '值为数组类型',
      '适合需要多选的场景',
      '可配合最大选择数限制'
    ]
  },
  {
    type: 'DATE',
    label: '日期选择',
    icon: <Calendar className="w-5 h-5" />,
    description: '日期选择器，支持选择年月日，可设置日期范围限制。',
    features: [
      '支持日期范围限制',
      '支持自定义格式',
      '支持快捷选择',
      '支持禁用特定日期'
    ],
    schemaExample: `{
  key: 'birthday',
  type: 'DATE',
  label: '出生日期',
  span: 6,
  ui: {
    placeholder: '请选择日期'
  }
}`,
    usageTips: [
      '返回 ISO 格式日期字符串',
      '可配合 min/max 限制范围',
      '支持默认值设置'
    ]
  },
  {
    type: 'DATETIME',
    label: '日期时间',
    icon: <Calendar className="w-5 h-5" />,
    description: '日期时间选择器，同时选择日期和具体时间。',
    features: [
      '支持日期+时间选择',
      '支持时间格式设置',
      '支持范围限制',
      '支持快捷选择'
    ],
    schemaExample: `{
  key: 'meeting_time',
  type: 'DATETIME',
  label: '会议时间',
  span: 6,
  ui: {
    description: '请选择会议日期和时间'
  }
}`,
    usageTips: [
      '包含日期和时间两部分',
      '适合需要精确时间的场景',
      '返回完整时间戳'
    ]
  },
  {
    type: 'DIMENSION',
    label: '级联维度',
    icon: <GitBranch className="w-5 h-5" />,
    description: '级联选择器，支持多级联动选择，如省市区、分类等。',
    features: [
      '支持多级联动',
      '支持动态加载选项',
      '支持自定义层级数',
      '支持搜索筛选'
    ],
    schemaExample: `{
  key: 'location',
  type: 'DIMENSION',
  label: '地区选择',
  span: 12,
  levels: [
    {
      label: '省份',
      placeholder: '请选择省份',
      options: [
        {
          value: 'beijing',
          label: '北京市',
          children: [
            { value: 'haidian', label: '海淀区' },
            { value: 'chaoyang', label: '朝阳区' }
          ]
        }
      ]
    },
    { label: '城市', placeholder: '请选择城市' }
  ]
}`,
    usageTips: [
      'levels 定义层级结构',
      'children 实现级联数据',
      '返回值为数组 [省, 市, 区]'
    ]
  },
  {
    type: 'RATING',
    label: '评分组件',
    icon: <Star className="w-5 h-5" />,
    description: '评分组件，支持星级评分，可用于评价、打分场景。',
    features: [
      '支持自定义最大星数',
      '支持半星评分',
      '支持只读模式',
      '支持自定义图标'
    ],
    schemaExample: `{
  key: 'rating',
  type: 'RATING',
  label: '商品评分',
  span: 4,
  max: 5,
  allowHalf: true
}`,
    usageTips: [
      'max 设置最大星数',
      'allowHalf 允许半星选择',
      '值为数字类型 (0-max)'
    ]
  },
  {
    type: 'COLOR',
    label: '颜色选择',
    icon: <Droplet className="w-5 h-5" />,
    description: '颜色选择器，支持选择颜色值，返回十六进制颜色代码。',
    features: [
      '支持颜色选择器',
      '支持手动输入颜色值',
      '支持预设颜色',
      '支持透明度设置'
    ],
    schemaExample: `{
  key: 'theme_color',
  type: 'COLOR',
  label: '主题颜色',
  span: 4,
  ui: {
    description: '选择品牌主题色'
  }
}`,
    usageTips: [
      '返回十六进制颜色值',
      '如 #FF5733',
      '适合需要颜色选择的场景'
    ]
  },
  {
    type: 'FILE',
    label: '文件上传',
    icon: <Upload className="w-5 h-5" />,
    description: '文件上传组件，支持单文件和多文件上传。',
    features: [
      '支持单/多文件上传',
      '支持文件类型限制',
      '支持文件大小限制',
      '支持拖拽上传'
    ],
    schemaExample: `{
  key: 'attachment',
  type: 'FILE',
  label: '附件上传',
  span: 6,
  accept: '.pdf,.doc,.docx',
  multiple: true,
  ui: {
    description: '支持 PDF、Word 文档'
  }
}`,
    usageTips: [
      'accept 限制文件类型',
      'multiple 允许多文件',
      '返回文件对象或文件列表'
    ]
  },
  {
    type: 'READONLY',
    label: '只读字段',
    icon: <Lock className="w-5 h-5" />,
    description: '只读展示字段，用于显示不可编辑的数据，如计算结果、系统值。',
    features: [
      '只读展示模式',
      '支持格式化显示',
      '支持货币/百分比格式',
      '支持表达式计算'
    ],
    schemaExample: `{
  key: 'total',
  type: 'READONLY',
  label: '合计金额',
  span: 6,
  format: 'currency',
  expression: 'price * quantity'
}`,
    usageTips: [
      '适合展示计算结果',
      'format 设置显示格式',
      'expression 实现动态计算'
    ]
  },
  {
    type: 'HIDDEN',
    label: '隐藏字段',
    icon: <Eye className="w-5 h-5" />,
    description: '隐藏字段，不在界面显示，用于存储不需要用户输入的数据。',
    features: [
      '界面不可见',
      '值会随表单提交',
      '适合存储临时数据',
      '支持表达式计算'
    ],
    schemaExample: `{
  key: 'user_id',
  type: 'HIDDEN',
  label: '用户ID',
  expression: 'currentUser.id'
}`,
    usageTips: [
      '不占用界面空间',
      '值仍会包含在表单数据中',
      '适合存储关联ID等'
    ]
  }
];

interface ComputationDemoInfo {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  schema: FieldSchema[];
  initialValues: Record<string, any>;
  explanation: string;
  features: string[];
}

const computationDemos: ComputationDemoInfo[] = [
  {
    id: 'basic-calc',
    label: '基础四则运算',
    icon: <Calculator className="w-5 h-5" />,
    description: '演示基本的加减乘除运算，当输入值变化时，计算结果自动更新。',
    schema: [
      { key: 'price', type: 'NUMBER', label: '单价', span: 6, min: 0 },
      { key: 'quantity', type: 'NUMBER', label: '数量', span: 6, min: 1 },
      { key: 'discount', type: 'NUMBER', label: '折扣 (%)', span: 6, min: 0, max: 100 },
      { 
        key: 'subtotal', 
        type: 'MONETARY', 
        label: '小计', 
        span: 6, 
        prefix: '¥',
        read_only: true,
        expression: 'price * quantity'
      },
      { 
        key: 'discount_amount', 
        type: 'MONETARY', 
        label: '优惠金额', 
        span: 6, 
        prefix: '¥',
        read_only: true,
        expression: 'subtotal * discount / 100'
      },
      { 
        key: 'total', 
        type: 'MONETARY', 
        label: '应付金额', 
        span: 12, 
        prefix: '¥',
        read_only: true,
        expression: 'subtotal - discount_amount'
      }
    ],
    initialValues: { price: 100, quantity: 2, discount: 10, subtotal: 200, discount_amount: 20, total: 180 },
    explanation: '当单价、数量或折扣发生变化时，小计、优惠金额和应付金额会自动重新计算。表达式使用字段 key 作为变量名，引擎自动追踪依赖关系。',
    features: [
      '支持 +、-、*、/ 四则运算',
      '支持括号控制运算优先级',
      '自动追踪字段依赖关系',
      '值变化时自动触发重算'
    ]
  },
  {
    id: 'tax-calc',
    label: '税费计算',
    icon: <Percent className="w-5 h-5" />,
    description: '演示含税价与不含税价的换算，支持不同税率场景。',
    schema: [
      { key: 'amount', type: 'MONETARY', label: '金额', span: 6, prefix: '¥' },
      { 
        key: 'tax_rate', 
        type: 'ENUM', 
        label: '税率', 
        span: 6,
        options: [
          { value: 0.03, label: '3% - 小规模纳税人' },
          { value: 0.06, label: '6% - 现代服务业' },
          { value: 0.09, label: '9% - 建筑业' },
          { value: 0.13, label: '13% - 一般纳税人' }
        ]
      },
      { 
        key: 'tax_amount', 
        type: 'MONETARY', 
        label: '税额', 
        span: 6, 
        prefix: '¥',
        read_only: true,
        expression: 'amount * tax_rate'
      },
      { 
        key: 'total_with_tax', 
        type: 'MONETARY', 
        label: '价税合计', 
        span: 6, 
        prefix: '¥',
        read_only: true,
        expression: 'amount + tax_amount'
      }
    ],
    initialValues: { amount: 10000, tax_rate: 0.13, tax_amount: 1300, total_with_tax: 11300 },
    explanation: '选择不同税率后，税额和价税合计会自动计算。ENUM 类型的 value 可以是任意类型（包括数字），在表达式中直接使用。',
    features: [
      'ENUM 选项值支持数字类型',
      '表达式支持小数运算',
      '链式计算自动传播',
      '浮点数精度自动处理'
    ]
  },
  {
    id: 'profit-calc',
    label: '利润分析',
    icon: <TrendingUp className="w-5 h-5" />,
    description: '演示成本、收入、利润的计算关系，包含利润率等指标。',
    schema: [
      { key: 'revenue', type: 'MONETARY', label: '营业收入', span: 6, prefix: '¥' },
      { key: 'cost', type: 'MONETARY', label: '营业成本', span: 6, prefix: '¥' },
      { key: 'operating_expense', type: 'MONETARY', label: '运营费用', span: 6, prefix: '¥' },
      { key: 'other_income', type: 'MONETARY', label: '其他收入', span: 6, prefix: '¥' },
      { 
        key: 'gross_profit', 
        type: 'MONETARY', 
        label: '毛利润', 
        span: 6, 
        prefix: '¥',
        read_only: true,
        expression: 'revenue - cost'
      },
      { 
        key: 'net_profit', 
        type: 'MONETARY', 
        label: '净利润', 
        span: 6, 
        prefix: '¥',
        read_only: true,
        expression: 'gross_profit - operating_expense + other_income'
      },
      { 
        key: 'profit_margin', 
        type: 'NUMBER', 
        label: '利润率', 
        span: 6,
        suffix: '%',
        read_only: true,
        expression: 'net_profit / revenue * 100'
      }
    ],
    initialValues: { revenue: 100000, cost: 60000, operating_expense: 15000, other_income: 5000, gross_profit: 40000, net_profit: 30000, profit_margin: 30 },
    explanation: '多字段联动计算，毛利润依赖收入和成本，净利润依赖毛利润、运营费用和其他收入，利润率依赖净利润和收入。引擎自动构建 DAG 依赖图。',
    features: [
      '多级依赖链式计算',
      'DAG 自动拓扑排序',
      '循环依赖自动检测',
      '精确更新受影响字段'
    ]
  },
  {
    id: 'invoice-calc',
    label: '发票金额拆分',
    icon: <Receipt className="w-5 h-5" />,
    description: '演示发票金额按比例拆分计算，适用于多项目开票场景。',
    schema: [
      { key: 'total_amount', type: 'MONETARY', label: '发票总额', span: 6, prefix: '¥' },
      { key: 'item1_ratio', type: 'NUMBER', label: '项目一比例', span: 6, suffix: '%', min: 0, max: 100 },
      { key: 'item2_ratio', type: 'NUMBER', label: '项目二比例', span: 6, suffix: '%', min: 0, max: 100 },
      { key: 'item3_ratio', type: 'NUMBER', label: '项目三比例', span: 6, suffix: '%', min: 0, max: 100 },
      { 
        key: 'item1_amount', 
        type: 'MONETARY', 
        label: '项目一金额', 
        span: 6, 
        prefix: '¥',
        read_only: true,
        expression: 'total_amount * item1_ratio / 100'
      },
      { 
        key: 'item2_amount', 
        type: 'MONETARY', 
        label: '项目二金额', 
        span: 6, 
        prefix: '¥',
        read_only: true,
        expression: 'total_amount * item2_ratio / 100'
      },
      { 
        key: 'item3_amount', 
        type: 'MONETARY', 
        label: '项目三金额', 
        span: 12, 
        prefix: '¥',
        read_only: true,
        expression: 'total_amount * item3_ratio / 100'
      }
    ],
    initialValues: { total_amount: 50000, item1_ratio: 40, item2_ratio: 35, item3_ratio: 25, item1_amount: 20000, item2_amount: 17500, item3_amount: 12500 },
    explanation: '修改总额或任一比例，对应项目金额自动重算。适用于需要按比例拆分发票金额的业务场景。',
    features: [
      '百分比与金额联动',
      '多字段并行计算',
      '实时响应输入变化',
      '支持业务规则配置'
    ]
  },
  {
    id: 'compound-interest',
    label: '复利计算',
    icon: <PiggyBank className="w-5 h-5" />,
    description: '演示复利计算，展示本金、利率、期数与最终金额的关系。使用 Shunting-yard 算法解析复杂表达式。',
    schema: [
      { key: 'principal', type: 'MONETARY', label: '本金', span: 6, prefix: '¥' },
      { key: 'rate', type: 'NUMBER', label: '年利率', span: 6, suffix: '%', min: 0, max: 100, step: 0.1 },
      { key: 'years', type: 'NUMBER', label: '投资年限', span: 6, suffix: '年', min: 1, max: 30 },
      { key: 'compound_times', type: 'NUMBER', label: '年复利次数', span: 6, min: 1, max: 365 },
      { 
        key: 'final_amount', 
        type: 'MONETARY', 
        label: '到期金额', 
        span: 6, 
        prefix: '¥',
        read_only: true,
        expression: 'principal * Math.pow(1 + rate/100/compound_times, years * compound_times)'
      },
      { 
        key: 'interest_earned', 
        type: 'MONETARY', 
        label: '利息收益', 
        span: 6, 
        prefix: '¥',
        read_only: true,
        expression: 'final_amount - principal'
      }
    ],
    initialValues: { principal: 100000, rate: 5, years: 5, compound_times: 12, final_amount: 128335, interest_earned: 28335 },
    explanation: '使用 Shunting-yard 算法将中缀表达式转为后缀表达式（RPN）执行。支持 Math.pow、Math.round、Math.floor、Math.ceil、Math.abs 等函数，以及 IF 条件函数。',
    features: [
      'Shunting-yard 算法解析',
      '支持 Math 内置函数',
      '支持嵌套函数调用',
      '无死循环风险'
    ]
  },
  {
    id: 'conditional-calc',
    label: '条件计算',
    icon: <GitBranch className="w-5 h-5" />,
    description: '演示条件表达式和逻辑运算符，支持 IF 函数实现动态计算规则。',
    schema: [
      { key: 'amount', type: 'MONETARY', label: '订单金额', span: 6, prefix: '¥' },
      { 
        key: 'member_level', 
        type: 'ENUM', 
        label: '会员等级', 
        span: 6,
        options: [
          { value: 'normal', label: '普通会员' },
          { value: 'silver', label: '银卡会员' },
          { value: 'gold', label: '金卡会员' },
          { value: 'platinum', label: '白金会员' }
        ]
      },
      { 
        key: 'discount_rate', 
        type: 'NUMBER', 
        label: '折扣率', 
        span: 6,
        suffix: '%',
        read_only: true,
        expression: 'IF(member_level == "platinum", 20, IF(member_level == "gold", 15, IF(member_level == "silver", 10, 5)))'
      },
      { 
        key: 'discount_amount', 
        type: 'MONETARY', 
        label: '优惠金额', 
        span: 6, 
        prefix: '¥',
        read_only: true,
        expression: 'amount * discount_rate / 100'
      },
      { 
        key: 'final_price', 
        type: 'MONETARY', 
        label: '实付金额', 
        span: 12, 
        prefix: '¥',
        read_only: true,
        expression: 'amount - discount_amount'
      }
    ],
    initialValues: { amount: 1000, member_level: 'gold', discount_rate: 15, discount_amount: 150, final_price: 850 },
    explanation: '使用 IF 函数实现多级条件判断，支持嵌套 IF。同时支持逻辑运算符 >、<、==、!=、&&、|| 构建复杂条件表达式。',
    features: [
      'IF 条件函数',
      '逻辑运算符支持',
      '嵌套条件判断',
      '字符串比较'
    ]
  }
];

const CodeBlock = ({ title, code }: { title: string; code: string }) => (
  <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-950 shadow-lg">
    <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
      <span className="text-xs font-bold text-slate-200">{title}</span>
      <div className="flex space-x-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
      </div>
    </div>
    <div className="p-4 overflow-x-auto">
      <pre className="text-xs font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  </div>
);

function FieldDemo({ fieldInfo, demoSchema }: { fieldInfo: FieldTypeInfo; demoSchema: FieldSchema[] }) {
  const [viewMode, setViewMode] = useState<'preview' | 'schema'>('preview');
  const engine = useFormEngine();

  const handleGetValue = () => {
    const values = engine.getStore().getState();
    console.log('当前字段值:', values.demo_field);
    alert(`当前值: ${JSON.stringify(values.demo_field)}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            {fieldInfo.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{fieldInfo.label}</h2>
            <p className="text-slate-500 text-sm mt-0.5">{fieldInfo.type}</p>
          </div>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
          <button 
            onClick={() => setViewMode('preview')}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors ${viewMode === 'preview' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Eye className="w-4 h-4 mr-2" /> 预览
          </button>
          <button 
            onClick={() => setViewMode('schema')}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors ${viewMode === 'schema' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <FileCode className="w-4 h-4 mr-2" /> Schema
          </button>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed">{fieldInfo.description}</p>

      {viewMode === 'preview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center">
                <Layers className="w-4 h-4 mr-2 text-indigo-600" />
                组件预览
              </h3>
              <FormField fieldKey="demo_field" />
              <div className="mt-4 pt-4 border-t border-slate-200">
                <button 
                  onClick={handleGetValue}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  查看当前值 →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
                功能特性
              </h3>
              <ul className="space-y-2">
                {fieldInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <CodeBlock title="Schema 定义" code={fieldInfo.schemaExample} />

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center">
                <Code className="w-4 h-4 mr-2" />
                使用技巧
              </h3>
              <ul className="space-y-2">
                {fieldInfo.usageTips.map((tip, index) => (
                  <li key={index} className="flex items-start text-sm text-indigo-700">
                    <span className="text-indigo-500 mr-2">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <CodeBlock title="完整 Schema 定义" code={JSON.stringify(demoSchema, null, 2)} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">可用属性</h3>
              <div className="space-y-2 text-sm">
                {fieldInfo.type === 'TEXT' && (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">key</span><span className="text-slate-700">字段唯一标识</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">type</span><span className="text-slate-700">'TEXT'</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">label</span><span className="text-slate-700">字段标签</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">span</span><span className="text-slate-700">宽度 (1-12)</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">ui.placeholder</span><span className="text-slate-700">占位文本</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">slot.prefix</span><span className="text-slate-700">前缀内容</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-500">slot.suffix</span><span className="text-slate-700">后缀内容</span></div>
                  </>
                )}
                {fieldInfo.type === 'NUMBER' && (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">min</span><span className="text-slate-700">最小值</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">max</span><span className="text-slate-700">最大值</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">step</span><span className="text-slate-700">步进值</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">prefix</span><span className="text-slate-700">前缀</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-500">suffix</span><span className="text-slate-700">后缀</span></div>
                  </>
                )}
                {fieldInfo.type === 'ENUM' && (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">options</span><span className="text-slate-700">选项数组</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">options[].value</span><span className="text-slate-700">选项值</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-500">options[].label</span><span className="text-slate-700">显示文本</span></div>
                  </>
                )}
                {fieldInfo.type === 'DIMENSION' && (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">levels</span><span className="text-slate-700">层级数组</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">levels[].label</span><span className="text-slate-700">层级标签</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">levels[].options</span><span className="text-slate-700">层级选项</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-500">options[].children</span><span className="text-slate-700">子级选项</span></div>
                  </>
                )}
                {!['TEXT', 'NUMBER', 'ENUM', 'DIMENSION'].includes(fieldInfo.type) && (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">key</span><span className="text-slate-700">字段唯一标识</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">type</span><span className="text-slate-700">字段类型</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">label</span><span className="text-slate-700">字段标签</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-500">span</span><span className="text-slate-700">宽度 (1-12)</span></div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">数据类型</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-mono rounded">string</div>
                  {['TEXT', 'TEXTAREA', 'DATE', 'DATETIME', 'COLOR', 'ENUM', 'RADIO'].includes(fieldInfo.type) && (
                    <span className="text-sm text-slate-600">此类型返回字符串</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-mono rounded">number</div>
                  {['NUMBER', 'MONETARY', 'SLIDER', 'RATING'].includes(fieldInfo.type) && (
                    <span className="text-sm text-slate-600">此类型返回数字</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-mono rounded">boolean</div>
                  {['BOOLEAN', 'SWITCH'].includes(fieldInfo.type) && (
                    <span className="text-sm text-slate-600">此类型返回布尔值</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-mono rounded">array</div>
                  {['CHECKBOX', 'DIMENSION'].includes(fieldInfo.type) && (
                    <span className="text-sm text-slate-600">此类型返回数组</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComputationDemo({ demoInfo }: { demoInfo: ComputationDemoInfo }) {
  const engine = useFormEngine();
  const [showSchema, setShowSchema] = useState(false);

  const handleShowValues = () => {
    const values = engine.getStore().getState();
    console.log('当前表单值:', values);
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
            {demoInfo.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{demoInfo.label}</h2>
            <p className="text-slate-500 text-sm mt-0.5">表达式计算演示</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowSchema(!showSchema)}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center transition-colors border ${showSchema ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            <FileCode className="w-4 h-4 mr-2" /> Schema
          </button>
          <button 
            onClick={handleShowValues}
            className="px-4 py-2 text-sm font-medium rounded-lg flex items-center transition-colors bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          >
            <Eye className="w-4 h-4 mr-2" /> 查看数据
          </button>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed">{demoInfo.description}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center">
              <Calculator className="w-4 h-4 mr-2 text-emerald-600" />
              计算表单
            </h3>
            <div className="grid grid-cols-12 gap-4">
              {demoInfo.schema.map(field => {
                const span = field.span || 12;
                const widthPercent = (span / 12) * 100;
                return (
                  <div 
                    key={field.key} 
                    style={{ 
                      gridColumn: `span ${span}`,
                      width: '100%'
                    }}
                  >
                    <FormField fieldKey={field.key} />
                  </div>
                );
              })}
            </div>
          </div>

          {showSchema && (
            <CodeBlock title="Schema 定义" code={JSON.stringify(demoInfo.schema, null, 2)} />
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-amber-500" />
              计算特性
            </h3>
            <ul className="space-y-2">
              {demoInfo.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
            <h3 className="text-sm font-bold text-emerald-900 mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              工作原理
            </h3>
            <p className="text-sm text-emerald-700 leading-relaxed">
              {demoInfo.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

type NavGroup = 'fields' | 'computation';

export const FormxReactDemoView = () => {
  const [activeGroup, setActiveGroup] = useState<NavGroup>('fields');
  const [activeFieldIndex, setActiveFieldIndex] = useState(0);
  const [activeComputationIndex, setActiveComputationIndex] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    fields: true,
    computation: true
  });

  const currentFieldInfo = fieldTypeInfos[activeFieldIndex];
  const currentComputationInfo = computationDemos[activeComputationIndex];

  const demoSchema: FieldSchema[] = useMemo(() => {
    const baseSchema: FieldSchema = {
      key: 'demo_field',
      type: currentFieldInfo.type as any,
      label: currentFieldInfo.label,
      span: 12
    };

    switch (currentFieldInfo.type) {
      case 'TEXT':
        return [{ ...baseSchema, ui: { placeholder: '请输入文本内容...' } }];
      case 'TEXTAREA':
        return [{ ...baseSchema, rows: 4, ui: { placeholder: '请输入详细描述...' } }];
      case 'NUMBER':
        return [{ ...baseSchema, min: 0, max: 100, step: 1 }];
      case 'MONETARY':
        return [{ ...baseSchema, prefix: '¥', suffix: '元' }];
      case 'SLIDER':
        return [{ ...baseSchema, min: 0, max: 100, step: 5, showValue: true }];
      case 'BOOLEAN':
        return [{ ...baseSchema, label: '我已阅读并同意相关条款' }];
      case 'SWITCH':
        return [{ ...baseSchema, label: '启用此功能' }];
      case 'ENUM':
        return [{
          ...baseSchema,
          options: [
            { value: 'opt1', label: '选项一' },
            { value: 'opt2', label: '选项二' },
            { value: 'opt3', label: '选项三' }
          ]
        }];
      case 'RADIO':
        return [{
          ...baseSchema,
          direction: 'horizontal',
          options: [
            { value: 'male', label: '男' },
            { value: 'female', label: '女' },
            { value: 'other', label: '其他' }
          ]
        }];
      case 'CHECKBOX':
        return [{
          ...baseSchema,
          options: [
            { value: 'reading', label: '阅读' },
            { value: 'sports', label: '运动' },
            { value: 'music', label: '音乐' }
          ]
        }];
      case 'DATE':
        return [baseSchema];
      case 'DATETIME':
        return [baseSchema];
      case 'DIMENSION':
        return [{
          ...baseSchema,
          levels: [
            {
              label: '省份',
              placeholder: '请选择省份',
              options: [
                {
                  value: 'beijing',
                  label: '北京市',
                  children: [
                    { value: 'haidian', label: '海淀区' },
                    { value: 'chaoyang', label: '朝阳区' }
                  ]
                },
                {
                  value: 'shanghai',
                  label: '上海市',
                  children: [
                    { value: 'pudong', label: '浦东新区' },
                    { value: 'huangpu', label: '黄浦区' }
                  ]
                }
              ]
            },
            { label: '城市', placeholder: '请选择城市' }
          ]
        }];
      case 'RATING':
        return [{ ...baseSchema, max: 5, allowHalf: true }];
      case 'COLOR':
        return [baseSchema];
      case 'FILE':
        return [{ ...baseSchema, accept: '.pdf,.doc,.docx', multiple: true }];
      case 'READONLY':
        return [{ ...baseSchema, format: 'currency' }];
      case 'HIDDEN':
        return [baseSchema];
      default:
        return [baseSchema];
    }
  }, [currentFieldInfo]);

  const fieldInitialValues = useMemo(() => ({
    demo_field: currentFieldInfo.type === 'BOOLEAN' ? false : 
                currentFieldInfo.type === 'SWITCH' ? true :
                currentFieldInfo.type === 'CHECKBOX' ? [] :
                currentFieldInfo.type === 'DIMENSION' ? [] :
                currentFieldInfo.type === 'RATING' ? 0 :
                currentFieldInfo.type === 'COLOR' ? '#6366F1' :
                currentFieldInfo.type === 'NUMBER' ? 50 :
                currentFieldInfo.type === 'SLIDER' ? 50 :
                currentFieldInfo.type === 'MONETARY' ? 1000 : ''
  }), [currentFieldInfo.type]);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const selectField = (index: number) => {
    setActiveGroup('fields');
    setActiveFieldIndex(index);
  };

  const selectComputation = (index: number) => {
    setActiveGroup('computation');
    setActiveComputationIndex(index);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Package className="w-7 h-7 mr-3" />
              @enginx/formx-react
            </h1>
            <p className="text-indigo-100 mt-2">
              基于 React 和 TypeScript 构建的灵活、Schema 驱动的动态表单系统
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-indigo-200">版本</div>
            <div className="text-lg font-bold">2.0.0</div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-4">
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin">
              <div className="border-b border-slate-200">
                <button
                  onClick={() => toggleGroup('fields')}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    字段类型
                    <span className="text-xs font-normal text-slate-400 ml-1">({fieldTypeInfos.length})</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedGroups.fields ? '' : '-rotate-90'}`} />
                </button>
                <div 
                  className="overflow-hidden transition-all duration-200 ease-out"
                  style={{ 
                    maxHeight: expandedGroups.fields ? `${fieldTypeInfos.length * 44}px` : '0px',
                    opacity: expandedGroups.fields ? 1 : 0
                  }}
                >
                  {fieldTypeInfos.map((info, index) => (
                    <button
                      key={info.type}
                      onClick={() => selectField(index)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-all duration-150 border-l-2 ${
                        activeGroup === 'fields' && activeFieldIndex === index 
                          ? 'border-indigo-600 text-indigo-600 bg-indigo-50' 
                          : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <span className={`transition-colors duration-150 ${activeGroup === 'fields' && activeFieldIndex === index ? 'text-indigo-500' : 'text-slate-400'}`}>{info.icon}</span>
                      <span>{info.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => toggleGroup('computation')}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-500" />
                    计算能力
                    <span className="text-xs font-normal text-slate-400 ml-1">({computationDemos.length})</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedGroups.computation ? '' : '-rotate-90'}`} />
                </button>
                <div 
                  className="overflow-hidden transition-all duration-200 ease-out"
                  style={{ 
                    maxHeight: expandedGroups.computation ? `${computationDemos.length * 44}px` : '0px',
                    opacity: expandedGroups.computation ? 1 : 0
                  }}
                >
                  {computationDemos.map((info, index) => (
                    <button
                      key={info.id}
                      onClick={() => selectComputation(index)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-all duration-150 border-l-2 ${
                        activeGroup === 'computation' && activeComputationIndex === index 
                          ? 'border-emerald-600 text-emerald-600 bg-emerald-50' 
                          : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <span className={`transition-colors duration-150 ${activeGroup === 'computation' && activeComputationIndex === index ? 'text-emerald-500' : 'text-slate-400'}`}>{info.icon}</span>
                      <span>{info.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {activeGroup === 'fields' ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <FormProvider 
                schema={demoSchema} 
                initialValues={fieldInitialValues}
                onChange={(values) => console.log('字段变化:', values)}
              >
                <FieldDemo fieldInfo={currentFieldInfo} demoSchema={demoSchema} />
              </FormProvider>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <FormProvider 
                schema={currentComputationInfo.schema} 
                initialValues={currentComputationInfo.initialValues}
                onChange={(values) => console.log('表单变化:', values)}
              >
                <ComputationDemo demoInfo={currentComputationInfo} />
              </FormProvider>
            </div>
          )}

          <div className="mt-6 bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center">
              <Code className="w-4 h-4 mr-2 text-indigo-600" />
              快速开始
            </h3>
            <pre className="text-xs font-mono text-slate-600 bg-white p-4 rounded-lg border border-slate-200 overflow-x-auto">
{`import { FormProvider, FormField } from '@enginx/formx-react';

const schema = [
  { key: 'name', type: 'TEXT', label: '姓名' },
  { key: 'age', type: 'NUMBER', label: '年龄', min: 0, max: 150 },
  { 
    key: 'total', 
    type: 'MONETARY', 
    label: '总价',
    read_only: true,
    expression: 'price * quantity'
  }
];

<FormProvider schema={schema} initialValues={{ name: '', age: 0 }}>
  <FormField fieldKey="name" />
  <FormField fieldKey="age" />
  <FormField fieldKey="total" />
</FormProvider>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormxReactDemoView;
