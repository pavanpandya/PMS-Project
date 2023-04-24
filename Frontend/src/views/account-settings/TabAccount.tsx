// ** React Imports
import { SetStateAction, useEffect, useState } from 'react'
import { changeFacultyPassword, editFacultyProfile, facultyProfile, profile } from '../../@core/utils/ajax/profile'
import { useRouter } from 'next/router'
import ReactiveButton from 'reactive-button'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ** MUI Imports
import Box from '@mui/material/Box'

import { styled } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import { Card, CircularProgress, Modal, Typography } from '@mui/material'
import React from 'react'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

let role: string | null
if (typeof window !== 'undefined') {
  // Perform localStorage action
  role = localStorage.getItem('role')
}

const TabAccount = () => {
  // ** State
  const imgSrc = '/images/avatars/1.png'
  const [userData, setUserData] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [department, setDepartment] = useState<string>('')
  const [designation, setDesignation] = useState<string>('')
  const [maxProjects, setMaxProjects] = useState<number>(0)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [open, setOpen] = React.useState(false)
  const [openProfile, setOpenProfile] = React.useState(false)
  const handleProfileEditClose = () => setOpenProfile(false)
  const [isUpdateProfile, setIsUpdateProfile] = useState(false)
  const [isUpdatePasswordShown, setIsUpdatePasswordShown] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleClose = () => setOpen(false)

  const router = useRouter()

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  }

  const handleName = (event: { target: { value: SetStateAction<string> } }) => {
    setName(event.target.value)
  }

  const handleDepartment = (event: { target: { value: SetStateAction<string> } }) => {
    setDepartment(event.target.value)
  }

  const handleDesignation = (event: { target: { value: SetStateAction<string> } }) => {
    setDesignation(event.target.value)
  }
  const handleMaxProjects = (event: { target: { value: SetStateAction<number> } }) => {
    setMaxProjects(event.target.value)
  }
  const handlePhoneNumber = (event: { target: { value: SetStateAction<string> } }) => {
    setPhoneNumber(event.target.value)
  }

  const handleOldPasswordChange = (event: { target: { value: SetStateAction<string> } }) => {
    setOldPassword(event.target.value)
  }

  const handleNewPasswordChange = (event: { target: { value: SetStateAction<string> } }) => {
    setNewPassword(event.target.value)
  }

  const handleConfirmPasswordChange = (event: { target: { value: any } }) => {
    setConfirmPassword(event.target.value)
  }

  const handleProfileEditOpen = () => {
    setOpenProfile(true)
    setIsUpdateProfile(true)
  }

  const handleOpen = () => {
    setOpen(true)
    setIsUpdatePasswordShown(true)
  }

  //get profile data

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true)
      try {
        let data = null
        if (role === 'student') {
          data = await profile()
        } else if (role === 'faculty') {
          data = await facultyProfile()
        }
        console.log(data)
        setUserData(data)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }
    fetchProfileData()
  }, [])

  const fetchProfileAfterResponseOk = async () => {
    setLoading(true)
    try {
      let data = null
      if (role === 'student') {
        data = await profile()
      } else if (role === 'faculty') {
        data = await facultyProfile()
      }
      console.log(data)
      setUserData(data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  //edit profile
  const handleFacultyEditProfile = async () => {
    try {
      const response = await editFacultyProfile({ name, department, designation, maxProjects, phoneNumber })
      fetchProfileAfterResponseOk()
      setOpenProfile(false)

      toast.success('Profile Updated Successfully', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      console.log(response)
    } catch (error) {
      toast.error('Error While Uploading Profile', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    }
  }

  //change password
  const changePassword = async () => {
    try {
      const email = userData.email
      const response = await changeFacultyPassword({ email, oldPassword, newPassword })
      if (response) {
        router.push('/pages/login/')

        toast.success('Password Updated Successfully', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
      }
      if (!response.ok) {
        throw new Error('Error changing password')
        toast.error('Error While Updating Password', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Same as */}
      <ToastContainer />
      <CardContent>
        {loading ? (
          <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
        ) : (
          <Card sx={{ padding: 16, backgroundColor: '#e3f2fd' }}>
            {role === 'student' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ImgStyled sx={{ borderRadius: '50%' }} src={imgSrc} alt='Profile Pic' />
                </Box>
                <br />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#6c63ff', mb: 2 }}>
                    {userData.name}
                  </Typography>
                </Box>
                <Card
                  sx={{
                    padding: 4,
                    fontSize: '18px',
                    marginBottom: 2,
                    border: '2px solid #6c63ff',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Box sx={{ borderBottom: '1px solid #6c6s3ff', pb: 2, mb: 2 }}>
                    <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                      Profile Information
                    </Typography>
                  </Box>
                  <div sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                      Email
                    </Typography>
                    <Typography variant='body1' sx={{ mb: 2 }}>
                      {userData.email}
                    </Typography>
                    <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                      Department
                    </Typography>
                    <Typography variant='body1' sx={{ mb: 2 }}>
                      {userData.department}
                    </Typography>
                    <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                      Enrollment Number
                    </Typography>
                    <Typography variant='body1' sx={{ mb: 2 }}>
                      {userData.enrollment_number}
                    </Typography>
                  </div>
                </Card>
              </Box>
            )}
            {role === 'faculty' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ImgStyled sx={{ borderRadius: '50%' }} src={imgSrc} alt='Profile Pic' />
                </Box>
                <br />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#6c63ff', mb: 2 }}>
                    {userData.name}
                  </Typography>
                </Box>
                <Card
                  sx={{
                    padding: 4,
                    fontSize: '18px',
                    marginBottom: 2,
                    border: '2px solid #6c63ff',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Box sx={{ borderBottom: '1px solid #6c6s3ff', pb: 2, mb: 2 }}>
                    <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                      Profile Information
                    </Typography>
                  </Box>
                  <div sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                      Email
                    </Typography>
                    <Typography variant='body1' sx={{ mb: 2 }}>
                      {userData.email}
                    </Typography>
                    <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                      Department
                    </Typography>
                    <Typography variant='body1' sx={{ mb: 2 }}>
                      {userData.department}
                    </Typography>
                    <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                      Max Projects
                    </Typography>
                    <Typography variant='body1' sx={{ mb: 2 }}>
                      {userData.maxProjects}
                    </Typography>
                    <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                      Phone Number
                    </Typography>
                    <Typography variant='body1' sx={{ mb: 2 }}>
                      {userData.phoneNumber}
                    </Typography>
                    <div className='text-right'>
                      <ReactiveButton
                        onClick={handleProfileEditOpen}
                        color='violet'
                        idleText='Edit Profile'
                        loadingText='Loading'
                        successText='Done'
                        rounded={true}
                        shadow
                      />
                    </div>
                  </div>
                </Card>
                <div className='mb-2  mt-10 font-bold'>
                  <i className=' mr-2  text-lg font-bold'></i>
                  Solution Manager - Nisarg & Team
                </div>
                <div className='mb-2  font-bold'>University of Computer Science</div>

                <ReactiveButton
                  onClick={handleOpen}
                  color='violet'
                  idleText='Update Password'
                  loadingText='Loading'
                  successText='Done'
                  rounded={true}
                  shadow
                />
              </Box>
            )}
          </Card>
        )}
        <Modal
          open={openProfile}
          onClose={handleProfileEditClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            {isUpdateProfile && (
              <div className='mt-4'>
                <div className='mb-4'>
                  <label className='block  font-bold mb-2' htmlFor='name-input'>
                    Name
                  </label>
                  <input
                    className='shadow appearance-none  bg-transparent border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline'
                    id='name-input'
                    type='text'
                    placeholder={userData.name}
                    value={name}
                    onChange={handleName}
                  />
                </div>

                <div className='mb-6'>
                  <label className='block  font-bold mb-2' htmlFor='department-input'>
                    Designation
                  </label>
                  <input
                    className='shadow appearance-none  bg-transparent border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline'
                    id='department-input'
                    type='text'
                    placeholder={userData.designation}
                    value={designation}
                    onChange={handleDesignation}
                  />
                </div>
                <div className='mb-6'>
                  <div className='mb-4'>
                    <label htmlFor='department-select' className='block font-bold mb-2'>
                      Department:
                    </label>
                    <select
                      id='department-select'
                      name='department'
                      className='w-full border bg-transparent rounded-md px-3 py-2'
                      value={department}
                      onChange={handleDepartment}
                    >
                      <option className='text-black' value=''>
                        -- Select Department --
                      </option>
                      <option className='text-black' value='sales'>
                        Sales
                      </option>
                      <option className='text-black' value='marketing'>
                        Marketing
                      </option>
                      <option className='text-black' value='finance'>
                        Finance
                      </option>
                      <option className='text-black' value='operations'>
                        Operations
                      </option>
                    </select>
                  </div>
                </div>
                <div className='mb-6'>
                  <label className='block  bg-transparent font-bold mb-2' htmlFor='department-input'>
                    Max Projects
                  </label>
                  <input
                    className='shadow appearance-none  bg-transparent border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline'
                    id='department-input'
                    type='text'
                    placeholder={userData.maxProjects}
                    value={maxProjects}
                    onChange={handleMaxProjects}
                  />
                </div>
                <div className='mb-6'>
                  <label className='block  bg-transparent font-bold mb-2' htmlFor='department-input'>
                    Phone Number
                  </label>
                  <input
                    className='shadow appearance-none  bg-transparent border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline'
                    id='department-input'
                    type='text'
                    placeholder={userData.phoneNumber}
                    value={phoneNumber}
                    onChange={handlePhoneNumber}
                  />
                </div>
                <div className='flex items-center justify-center'>
                  <ReactiveButton
                    onClick={handleFacultyEditProfile}
                    color='violet'
                    idleText='Submit'
                    loadingText='Loading'
                    successText='Done'
                    rounded={true}
                    shadow
                  />
                </div>
              </div>
            )}
          </Box>
        </Modal>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            {isUpdatePasswordShown && (
              <div className='mt-4'>
                <div className='mb-4'>
                  <label className='block  font-bold mb-2' htmlFor='old-password-input'>
                    Old Password
                  </label>
                  <input
                    className='shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline'
                    id='old-password-input'
                    type='password'
                    placeholder='********'
                    onChange={handleOldPasswordChange}
                  />
                </div>
                <div className='mb-4'>
                  <label className='block  font-bold mb-2' htmlFor='new-password-input'>
                    New Password
                  </label>
                  <input
                    className='shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline'
                    id='new-password-input'
                    type='password'
                    placeholder='********'
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                </div>
                <div className='mb-6'>
                  <label className='block  font-bold mb-2' htmlFor='confirm-password-input'>
                    Confirm Password
                  </label>
                  <input
                    className='shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline'
                    id='confirm-password-input'
                    type='password'
                    placeholder='********'
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </div>
                <div className='flex items-center justify-center'>
                  <ReactiveButton
                    onClick={changePassword}
                    color='violet'
                    idleText='Submit'
                    loadingText='Loading'
                    successText='Done'
                    rounded={true}
                    shadow
                  />
                </div>
              </div>
            )}
          </Box>
        </Modal>
      </CardContent>
    </>
  )
}

export default TabAccount
