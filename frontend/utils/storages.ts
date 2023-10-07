import { ICommonObject } from '@/models'

export const getLs = (key: string) => {
   return JSON.parse(localStorage.getItem(key) || '{}')
}

export const setLs = (key: string, data: ICommonObject | boolean) => {
   localStorage.setItem(key, JSON.stringify(data))
}

export const removeLs = (key: string) => {
   localStorage.removeItem(key)
}

export const removeAll = () => {
   localStorage.clear()
}
