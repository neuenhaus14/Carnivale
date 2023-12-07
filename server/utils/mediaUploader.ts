// export const mediaUploader = async(files: File[]) => {
//   const media = [];

//   for (const file of files) {
//     const formData = new FormData()
//     formData.append('file', file)
//     formData.append('upload_preset', 'devSetups')
//     formData.append('cloud_name', 'dj5uxv8tg')

//     try {
//       const res = await fetch('https://api.cloudinary.com/v1_1/dj5uxv8tg/upload', {
//         method: 'POST',
//         body: formData
//       })
//       const data = await res.json()
//       media.push(data.secure_url)
//     } catch (err: any) {
//       console.log(err)
//     }
//   }
//   return media
// }