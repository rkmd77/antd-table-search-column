import * as Constants from './constants'
import { call, put } from 'redux-saga/effects'
import InvoicesAPI from './api'


export function* loadInvoices(action) {
  try {
    yield put({ type: Constants.LOAD_INVOICES_PENDING })
    const payload = yield call(InvoicesAPI.loadInvoices, action.params)
    if (payload && payload.status >= 200 && payload.status < 300) {
      yield put({ type: Constants.LOAD_INVOICES_FULFILLED, payload })
      try {
        yield* payload.data.map(function* (v){
          const res_merchant = yield call(InvoicesAPI.searchOrgByMerchantId, v.merchant_id)
          if (res_merchant && res_merchant.status >= 200 && res_merchant.status < 300) {
            const mdata = res_merchant.data
            v.merchant_name = mdata.company_name?mdata.company_name:''
            v.country = mdata.address?mdata.address.country:''
          }else {
            throw res_merchant
          }
          yield put({type: Constants.LOAD_MERCHANT_COMPLETED})
        })
      } catch(res_merchant){
        throw res_merchant
      }
    } else {
      throw payload
    }
  } catch (payload) {
    yield put({ type: Constants.LOAD_INVOICES_REJECTED, payload })
  }
}

export function* searchInvoicesBy(action) {
  try {
    yield put({ type: Constants.LOAD_INVOICES_PENDING })
    const payload = yield call(InvoicesAPI.searchInvoicesBy, action.params)
    if (payload && payload.status >= 200 && payload.status < 300) {
      yield put({ type: Constants.LOAD_INVOICES_FULFILLED, payload })
    } else {
      throw payload
    }
  } catch (payload) {
    yield put({ type: Constants.LOAD_INVOICES_REJECTED, payload })
  }
}
export function* searchOrgsBy(action) { // by merchant name
  console.log(action)
  try {
    yield put({ type: Constants.LOAD_INVOICES_PENDING })
    const payload = yield call(InvoicesAPI.searchOrgsBy, action.params)
    if (payload && payload.status >= 200 && payload.status < 300) {
      console.log(payload)
      yield put({ type: Constants.LOAD_INVOICES_FULFILLED, payload })
      try {
        yield* payload.data.map(function* (v){
          const searchbyparams = {
            [action.searchorgsby]: v.id
          }
          const payload_org = yield call(InvoicesAPI.searchInvoicesBy, searchbyparams)
          if (payload_org && payload_org.status >= 200 && payload_org.status < 300) {
            payload_org.data.forEach(function (w){
              w.merchant_name = v.company_name?v.company_name:''
              w.country = v.address?v.address.country:''
            })
            yield put({ type: Constants.LOAD_INVOICES_FULFILLED, payload: payload_org })
          } else {
            throw payload_org
          }
        })
      } catch(payload){
        yield put({ type: Constants.LOAD_INVOICES_REJECTED, payload })
        throw payload
      }
    } else {
      throw payload
    }
  } catch (payload) {
    yield put({ type: Constants.LOAD_INVOICES_REJECTED, payload })
  }
}

export function* downloadInvoices(action) {
  try {
    const payload = yield call(InvoicesAPI.downloadInvoices, action.params)
    if (payload && payload.status >= 200 && payload.status < 300) {
      const file = new Blob(
        [payload.data],
        {type: payload.headers['content-type']}) //vnd.ms-excel
      yield put({
        type: Constants.DOWNLOAD_INVOICES.toLowerCase(),
        data: URL.createObjectURL(file),
        // invoice: params.payload
      })
    } else {
      yield put({
        type: Constants.DOWNLOAD_INVOICES.toLowerCase(),
        data: ''
      })
      throw payload
    }
  } catch (payload) {
    throw payload
  }
}

export function* loadCovers(action) {
  try {
    yield put({ type: Constants.LOAD_INVOICES_PENDING })
    const payload = yield call(InvoicesAPI.loadCovers, action.params)
    if (payload && payload.status >= 200 && payload.status < 300) {
      yield put({ type: Constants.LOAD_INVOICES_FULFILLED, payload })
      try {
        yield* payload.data.map(function* (v){
          const res_merchant = yield call(InvoicesAPI.searchOrgByMerchantId, v.merchant_id)
          if (res_merchant && res_merchant.status >= 200 && res_merchant.status < 300) {
            const mdata = res_merchant.data
            v.merchant_name = mdata.company_name?mdata.company_name:''
            v.country = mdata.address?mdata.address.country:''
          }else {
            throw res_merchant
          }
          yield put({type: Constants.LOAD_MERCHANT_COMPLETED})
        })
      } catch(res_merchant){
        throw res_merchant
      }
    } else {
      throw payload
    }
  } catch (payload) {
    yield put({ type: Constants.LOAD_INVOICES_REJECTED, payload })
  }
}

