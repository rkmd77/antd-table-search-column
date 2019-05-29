import * as Constants from './constants'
import { makeRequest } from '../../utils/request'


export default class InvoicesAPI {

  static loadInvoices(params) {
    console.log(params)
    return makeRequest({
      headers: { 'Accept': 'application/json' },
      method: 'GET',
      url: `${Constants.LOAD_INVOICES_URL}`,
      params: params,
    })
  }
  static searchInvoicesBy(params) {
    console.log(params)
    return makeRequest({
      headers: { 'Accept': 'application/json' },
      method: 'GET',
      url: `${Constants.LOAD_INVOICES_URL}`,
      params: params,
    })
  }
  static searchOrgByMerchantId(params) {
    console.log(params)
    return makeRequest({
      headers: { 'Accept': 'application/json' },
      method: 'GET',
      url: `${Constants.SEARCH_ORG_BY_ID_URL}/${params}`,
      // params: params,
    })
  }
  static searchOrgsBy(params) {
    console.log(params)
    return makeRequest({
      headers: { 'Accept': 'application/json' },
      method: 'GET',
      url: `${Constants.SEARCH_ORG_BY_ID_URL}`,
      params: params,
    })
  }
  static downloadInvoices(params) {
    console.log(params)
    return makeRequest({
      headers: { 'Accept': 'application/json' },
      method: 'GET',
      responseType: 'blob',
      url: `${Constants.LOAD_INVOICES_URL}/${params.id}/document/${params.invoice_document_id}`,
    })
  }

  static loadCovers(params) {
    console.log(params)
    return makeRequest({
      headers: { 'Accept': 'application/json' },
      method: 'GET',
      url: `${Constants.LOAD_COVERS_URL}`,
      params: params,
    })
  }

}