import React, {useState, useEffect, useRef} from 'react'
import * as Constants from './constants'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { Card, Table, Input, Button, Icon, Badge, DatePicker } from 'antd'
import moment from 'moment'
import BreadCrumb from '../layout/breadcrumb'
import CreateInvoicesModal from './createInvoicesModal'

const propTypes = {
  createinvoices: PropTypes.object.isRequired,
}

function InvoicesTable(props) {
  const CreateInvoicesModalRef = useRef()
  const [inputRef, setInputRef] = useState()
  const { createinvoices } = props
  const [searchText, setsearchText] = useState({
    field: '',
    value: ''
  })
  const [selectedDate, setSelectedDate] = useState('')

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    defaultCurrent: 1,
    showSizeChanger: true,
  })

  const displayModal = () => {
    CreateInvoicesModalRef.current.showModal()
  }

  const loadInvoicesList = () => {
    const params = {
      limit: pagination.pageSize,
      offset: (pagination.current-1)*pagination.pageSize,
    }
    props.dispatch({ type: Constants.LOAD_INVOICES, params: params,})
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
    // loadInvoicesList()
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
        >Search</Button>
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

  const getColumnSearchProps_Date = (dataIndex) => ({// eslint-disable-next-line react/display-name
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <DatePicker
          defaultValue={moment()}
          onChange={(date, dateString) => setSelectedKeys(date)}
          format={dateFormat}
          style={{ minWidth: 180, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch_Date(selectedKeys, confirm, dataIndex, clearFilters)}
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
  })

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

  const payInvoice = (e) => {
    console.log(e)
  }

  const downloadPDF = (params) => {
    props.dispatch({ type: Constants.DOWNLOAD_INVOICES, params})
  }
  useEffect(() => {
    if(createinvoices.invoicePdfFile){
      var file_path = createinvoices.invoicePdfFile
      var a = document.createElement('A')
      a.href = file_path
      a.download = file_path.substr(file_path.lastIndexOf('/') + 1)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  })// eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (date) => {
    return date?moment.utc(date).format('DD-MMM-YYYY'):''
  }
  const onOk = (e) => {
    console.log(e)
    console.log(selectedDate)
  }
  const dateFormat = 'DD/MM/YYYY'
  const onDateChange_paid_date = (date, dateString) => {
    console.log(date, dateString)
    setSelectedDate(date)
    // let value = moment(e).utc().format()
    // console.log(value)
    // props.dispatch(PaymentActions.CollectNewPayment('due_date', value, 'new_payment_info'))
  }

  const column_invoices = [
    {
      title: '',
      dataIndex: 'invoice_document_id',
      // eslint-disable-next-line react/display-name
      render: (text, record) => {
        return record.invoice_document_id?<Icon type="download" onClick={()=>{downloadPDF(record)}} />:null
      },
    },
    {
      title: 'Inv Number',
      dataIndex: 'invoice_number',
      ...getColumnSearchProps('invoice_number'),
    },
    {
      title: 'Inv date',
      dataIndex: 'invoiced_date',
      ...getColumnSearchProps_Date('invoiced_date'),
      render: text => {
        return formatDate(text)
      },
    },
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
      title: 'Period ending',
      dataIndex: 'end_date',
      ...getColumnSearchProps('end_date'),
      render: text => {
        return formatDate(text)
      },
    },
    {
      title: 'Ctry dest',
      dataIndex: 'country_code',
      ...getColumnSearchProps('country_code'),
    },
    {
      title: 'Total',
      dataIndex: '',
      className: 'column-money',
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      ...getColumnSearchProps('currency'),
    },
    {
      title: 'Date created',
      dataIndex: 'date_created',
      ...getColumnSearchProps('date_created'),
      render: text => {
        return formatDate(text)
      },
    },
    {
      title: 'Created by',
      dataIndex: 'created_by',
      ...getColumnSearchProps('created_by'),
    },
    {
      title: 'Paid',
      // eslint-disable-next-line react/display-name
      render: (text, record) => {
        return record.paid_date?<Badge status={'success'} text={'Yes'} />:<Badge status={'error'} text={'No'} />
      },
    },
    {
      title: 'Date paid',
      dataIndex: 'paid_date',
      align: 'center',
      width: '100px',
      ...getColumnSearchProps('paid_date'),
      // eslint-disable-next-line react/display-name
      render: (text, record) => {
        return text?<DatePicker showTime defaultValue={text?moment.utc(text):moment()} onChange={onDateChange_paid_date} format={dateFormat} onOk={()=>onOk(record)} />:null
      },
    },
    {
      title: '',
      align: 'center',
      // eslint-disable-next-line react/display-name
      render: (text, record) => {
        return !record.paid_date?<Button icon='dollar' className='paidButton' type='primary' onClick={() => payInvoice(record)} size='small' >Paid</Button>:null
      },
    },
  ]

  pagination.total = parseInt(props.createinvoices.invoices_total)
  // eslint-disable-next-line react/display-name
  pagination.showTotal = (total) => {
    return <div>Total {total} invoices</div>
  }
  return(
    <React.Fragment>
      <BreadCrumb paths={['Home','Invoices']}/>
      <Card
        bordered={false}
        className='createInvoicesCard'
        // title = {`Search query:  ${searchText.field} ${searchText.field.length>0?'=':''} ${searchText.value}` }
        title = {<div>
          <Button icon='plus-circle' type='primary' onClick={displayModal} >Create invoices</Button>
          <Button icon='reload' type='default' onClick={handleReset} >Reset</Button>
        </div>
        }
      >
        <Table
          pagination={pagination}
          columns={column_invoices}
          dataSource={createinvoices.invoices}
          loading={createinvoices.invoices_pending}
          onChange={handleTableChange}
          rowKey={record => record.id}
          bordered={true}
          size='small'
        />
        <CreateInvoicesModal
          {...props}
          ref={CreateInvoicesModalRef}
        />
      </Card>
    </React.Fragment>
  )
}

InvoicesTable.propTypes = propTypes

const mapStateToProps = (state) => {
  return {createinvoices: state.createInvoicesReducer}
}

export default connect(
  mapStateToProps,
)(InvoicesTable)