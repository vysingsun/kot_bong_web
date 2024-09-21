export const getFromCache: any = (key: string) => {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${key}=`))
    ?.split('=')[1]
  console.log(value)
  return value ? JSON.parse(decodeURIComponent(value)) : null
}
