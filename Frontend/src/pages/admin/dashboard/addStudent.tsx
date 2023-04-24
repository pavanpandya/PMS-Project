import { Avatar, Box, Button, Card, Container, CssBaseline, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'

function AddStudentForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [enrollmentNumber, setEnrollmentNumber] = useState('')
  const [loading, setLoading] = useState(false)

  let bearerToken: string | null
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    bearerToken = localStorage.getItem('token')
  }

  const handleDepartmentChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setDepartment(event.target.value)
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/add-student`, {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          email: email,
          department: department,
          enrollment_number: enrollmentNumber
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`
        }
      })
      const data = await response.json()
      console.log(data)

      if (data.status == 200) {
        toast.success('Student Added Successfully', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
      } else {
        toast.error('Error While Adding Student', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
      }

      // Display the updated data to the UI
      // ...
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card sx={{ padding: 8 }}>
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
      <div className='justify-center'>
        <Container component='main' maxWidth='xs' className='contain2'>
          <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <AccountCircleIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Add Student
            </Typography>

            <Box component='form' noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
              <TextField
                margin='normal'
                required
                fullWidth
                id='name'
                label='Name'
                name='name'
                value={name}
                autoFocus
                onChange={event => setName(event.target.value)}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                value={email}
                label='Email'
                name='email'
                autoFocus
                onChange={event => setEmail(event.target.value)}
              />
              <div className='w-full'>
                <div className='relative'>
                  <select
                    className='block appearance-none bg-transparent w-full  border border-gray-400 hover:border-gray-500 p-4 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
                    id='department'
                    value={department}
                    onChange={handleDepartmentChange}
                  >
                    <option className='bg-transparent text-black' value=''>
                      --Please select a department--
                    </option>
                    <option className='bg-transparent text-black ' value='computer science'>
                      Computer Science
                    </option>
                    <option className='bg-transparent text-black' value='computer engineering'>
                      Computer Engineering
                    </option>
                    <option className='bg-transparent text-black' value='Information Technology'>
                      Information Technology
                    </option>
                  </select>
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                    <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                      <path d='M14.707 7.293a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 000-1.414z' />
                    </svg>
                  </div>
                </div>
              </div>
              <TextField
                margin='normal'
                required
                fullWidth
                value={enrollmentNumber}
                id='enrollmentNumber'
                label='Enrollment Number'
                name='enrollmentNumber'
                autoFocus
                onChange={event => setEnrollmentNumber(event.target.value)}
              />

              <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                Add Student
              </Button>
            </Box>
          </Box>
        </Container>
      </div>
    </Card>
  )
}

export default AddStudentForm
