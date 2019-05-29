import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle  } from 'react'
import * as Constants from './constants'
import PropTypes from 'prop-types'
import { Modal, Table, Input, Button, Icon, Badge, DatePicker } from 'antd'
import moment from 'moment'

const propTypes = {
  createinvoices: PropTypes.object.isRequired,
}

const CreateInvoicesModal = forwardRef((props, ref) => {
  const [inputRef, setInputRef] = useState()
  const { createinvoices } = props
  const [visibleDetail, setVisibleDetail] = useState(false)
  const [searchText, setsearchText] = useState({
    field: '',
    value: ''
  })
  const [selectedDate, setSelectedDate] = useState('')

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 1,
    total: 0,
    defaultCurrent: 1,
    showSizeChanger: true,
  })

  useImperativeHandle(ref, () => ({
    showModal: () => {
      setVisibleDetail(true)
      loadCoversList()
    }
  }))
  const handleCancel = () => {
    setVisibleDetail(false)
  }

  const loadCoversList = () => {
    const params = {
      limit: pagination.pageSize,
      offset: (pagination.current-1)*pagination.pageSize,
      group_by: 'merchant_id'
    }
    props.dispatch({ type: Constants.LOAD_COVERS, params: params,})
  }

  const handleTableChange = (pagination, filters) => {
    setsearchText({
      field: '',
      value: ''
    })
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters
    })
  }
  useEffect(() => {
    // loadCoversList()
  },[pagination.current, pagination.pageSize])// eslint-disable-line react-hooks/exhaustive-deps

  const getColumnSearchProps = (dataIndex) => ({// eslint-disable-next-line react/display-name
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => { setInputRef(node) }}
          placeholder={`Search ${dataIndex.indexOf('_')>-1 ? dataIndex.replace(/_/g,' '):dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex, clearFilters)}
          style={{ minWidth: 180, marginBottom: 8, display: 'block' }}
          suffix={
            <Icon type="close-circle" onClick={() => setSelectedKeys([])} />
          }
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex, clearFilters)}
          icon="search"
          size="small"
          style={{ width: '100%' }}
        >
          Search
        </Button>
      </div>
    ),// eslint-disable-next-line react/display-name
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilterDropdownVisibleChange: visible => {
      if (visible && inputRef) {
        setTimeout(() => inputRef.select())
      }
    },
  })
  useEffect(() => {
    if(inputRef){
      inputRef.select()
    }
  })

  const onDateChange_search = (date, dateString) => {
    console.log(date, dateString)
    setSelectedDate(date)
  }


  const handleSearch = (selectedKeys, confirm, dataIndex, clearFilters) => {
    console.log(selectedKeys)
    confirm()
    setsearchText({
      field: dataIndex.indexOf('_')>-1 ? dataIndex.replace(/_/g,' '):dataIndex,
      value: selectedKeys[0]
    })


    if(dataIndex==='merchant_name'){
      props.dispatch({ type: Constants.SEARCH_ORGS_BY, params: {name: selectedKeys[0]}, searchorgsby: 'merchant_id' })
    }
    else{
      const params = {
        limit: 10,
        offset: 0,
        [dataIndex]: selectedKeys[0]
      }
      props.dispatch({ type: Constants.LOAD_INVOICES, params: params,})
    }
    clearFilters()
  }

  const handleSearch_Date = (selectedKeys, confirm, dataIndex, clearFilters) => {
    console.log(selectedKeys.utc())
    console.log(selectedKeys.utc().format())
    confirm()
    setsearchText({
      field: dataIndex.indexOf('_')>-1 ? dataIndex.replace(/_/g,' '):dataIndex,
      value: formatDate(selectedKeys)
    })

    const params = {
      limit: 10,
      offset: 0,
      [dataIndex]: selectedKeys.utc().format()
    }
    props.dispatch({ type: Constants.LOAD_INVOICES, params: params,})
    clearFilters()
  }

  const handleReset = () => {
    const params = {
      limit: 10,
      offset: 0,
    }
    props.dispatch({ type: Constants.LOAD_INVOICES, params: params,})
  }

  const createInvoice =() => {

  }

  const formatDate = (date) => {
    return date?moment.utc(date).format('DD-MMM-YYYY'):''
  }
  const dateFormat = 'DD/MM/YYYY'
  const onDateChange_period_ending = (date, dateString) => {
    console.log(date, dateString)
    setSelectedDate(date)
    // let value = moment(e).utc().format()
    // console.log(value)
    // props.dispatch(PaymentActions.CollectNewPayment('due_date', value, 'new_payment_info'))
  }

  const column_covers = [
    {
      title: 'Ctry',
      dataIndex: 'country',
      ...getColumnSearchProps('country'),
    },
    {
      title: 'Merchant',
      dataIndex: 'merchant_name',
      ...getColumnSearchProps('merchant_name'),
    },
    {
      title: 'Ctry dest',
      dataIndex: 'country_code',
      ...getColumnSearchProps('country_code'),
    },
    {
      title: 'Qty sales',
      dataIndex: 'qty',
    },
    {
      title: 'Qty cancel',
      dataIndex: '',
      className: 'column-money',
    },
    {
      title: 'Qty total',
      dataIndex: 'date_created',
    },
    {
      title: 'Fee sales',
      dataIndex: 'created_by1',
    },
    {
      title: 'Fee cancel',
      dataIndex: 'created_by2',
    },
    {
      title: 'Fee total',
      dataIndex: 'created_by3',
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
    },
    {
      title: '',
      align: 'center',
      // eslint-disable-next-line react/display-name
      render: (text, record) => {
        return <Button icon='save' className='paidButton' type='primary' onClick={() => createInvoice(record)} size='small' >Create</Button>
      },
    },
  ]

  pagination.total = parseInt(props.createinvoices.invoices_total)
  // eslint-disable-next-line react/display-name
  pagination.showTotal = (total) => {
    return <div>Total {total} invoices</div>
  }
  return(
    <Modal
      visible={visibleDetail}
      width={1200}
      className='createInvoicesModal'
      title={'Create invoices'}
      onOk={handleCancel}
      onCancel={handleCancel}
      // footer={[<Button key='close' icon='close' type='default' style={{float: 'left'}} onClick={handleCancel}>Cancel</Button>]}
    >
      <span className='periodending'>Period ending</span>
      <DatePicker defaultValue={moment()} onChange={onDateChange_period_ending} format={dateFormat} />
      <br /><br />
      <Table
        pagination={pagination}
        columns={column_covers}
        dataSource={createinvoices.covers}
        loading={createinvoices.invoices_pending}
        onChange={handleTableChange}
        rowKey={record => record.id}
        bordered={true}
        size='small'
      />
    </Modal>
  )
})

CreateInvoicesModal.propTypes = propTypes
export default CreateInvoicesModal