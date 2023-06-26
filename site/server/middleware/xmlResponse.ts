import { setHeader } from 'h3'

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/xml; charset=utf-8')
})
