import axios from 'axios'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default axios