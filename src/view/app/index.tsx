/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { Fragment, useEffect, useState } from 'react'

function App() {
  const option = ['jpg', 'png', 'webp']
  // Upload DOM
  const [el, setEl] = useState<HTMLInputElement>()
  const [imgSrc, setImgSrc] = useState<string>()
  const [type, setType] = useState<string>('jpg')
  const [beforeTotal, setBeforeTotal] = useState<number>()
  const [afterTotal, setAfterTotal] = useState<number>()
  const [height, setHeight] = useState<number>()
  const handleUpload = () => {
    if (!el) return
    el.click()
  }
  const GetImageInfo = () => {
    return new Promise((resolve, reject) => {
      const imgFile = new FileReader()
      try {
        if (!el) {
          reject('')
          return
        }
        const list = (el as HTMLInputElement)?.files as FileList
        imgFile.readAsDataURL(list[0])
        imgFile.onload = function (e) {
          let img = new Image()
          img.src = e.target?.result as string
          setBeforeTotal(e.total as number)
          img.onload = function () {
            resolve(img)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }
  const handleTransform = () => {
    const list = (el as HTMLInputElement)?.files as FileList
    if (!list || list.length === 0) return
    GetImageInfo().then(img => {
      const image = img as HTMLImageElement
      const canvas = imgToCanvas(image)
      // console.log(canvasToImg(canvas).total)
      setImgSrc(canvasToImg(canvas))
      console.log(document.getElementById('img'))
    })
  }
  const handleClick = (e: any) => {
    // console.log(e.target.outerText.toLowerCase())
    setType(e.target.outerText.toLowerCase())
  }
  const imgToCanvas = (img: HTMLImageElement): HTMLCanvasElement => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    canvas.getContext('2d')?.drawImage(img, 0, 0)
    return canvas
  }
  const canvasToImg = (canvas: HTMLCanvasElement) => {
    return canvas.toDataURL(`image/${type}`, 0.4)
  }
  useEffect(() => {
    // did mounted
    setEl(document.getElementById('Upload') as HTMLInputElement)
    const content = document.getElementById('content') as HTMLElement
    setHeight(content?.clientHeight)
    console.log(content?.clientHeight)
  }, [])
  return (
    <div className='flex flex-col h-screen  box-content'>
      <div className='h-16 shadow-md w-full bg-slate-50 hover:shadow-lg'></div>
      <div className='flex-auto p-12'>
        <div className=' border-gray-50 flex  w-full h-full'>
          <div className='flex flex-col  shadow  mx-4 border border-shadow rounded-lg min-w-max w-72'>
            <div className='p-4 font-mono text-lg border-b border-gray-300 border-solid '>
              <span>Transform Picture</span>
            </div>
            <div className='p-4 flex-1'>
              <div onClick={handleUpload} className='cursor-pointer p-2 rounded border border-dashed flex justify-center hover:shadow' title='Upload Picture'>
                <span className='text-4xl block my-24 '>+</span>
                <input className='hidden' type='file' name='upload' id='Upload' />
              </div>
              <div className='text text-center my-2'>
                <span>请上传图片</span>
              </div>
              <div className='text-center'>
                <button onClick={handleTransform}>开始转换</button>
              </div>
              <div className='flex justify-evenly mt-4'>
                <div className=''>{beforeTotal ? <span>{beforeTotal}</span> : ''}</div>
                <div className=''>
                  <span>to</span>
                </div>
                <div className=''>{afterTotal ? <span>{afterTotal}</span> : ''}</div>
              </div>
            </div>
            <div className='p-4 min-h-max border-t border-solid border-gray-300'>
              <div className='text'>
                <span className='rounded m-auto block px-2 py-1 w-max'>Export</span>
              </div>
              <div className='flex justify-evenly mt-8 h-max'>
                {option.map(i => (
                  <span
                    key={i}
                    onClick={handleClick}
                    className={`block cursor-pointer hover:bg-teal-300 hover:text-yellow-100 bg-slate-400 py-1 mx-2 rounded-md w-16 text-center uppercase ${
                      i === type ? 'bg-teal-300 text-yellow-100' : ''
                    }`}
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className='flex-auto shadow min-w-max mx-4 border  border-shadow rounded-lg p-4 ' id='content'>
            <div className='overflow-auto' style={{ height: `${(height as number) - 48}px` }}>
              <img src={imgSrc} alt='' className='w-auto h-full' id='img' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
