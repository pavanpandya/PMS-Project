import { Avatar, Box, Button, Card, Container, CssBaseline, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

import { toast, ToastContainer } from 'react-toastify'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import 'react-toastify/dist/ReactToastify.css'

function AddFacultyForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState('')
  const [loading, setLoading] = useState(false)
  let bearerToken
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    bearerToken = localStorage.getItem('token')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/add-faculty`, {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          email: email,
          department: department,
          phoneNumber: phone
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`
        }
      })
      const data = await response.json()
      console.log(data)

      if (data.status == 200) {
        toast.success('Faculty Added Successfully', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
      } else {
        toast.error('Error While Adding Faculty', {
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

  const handleDepartmentChange = event => {
    setDepartment(event.target.value)
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
      <div>
        {/* Same as */}
        <ToastContainer />
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
              Add Faculty
            </Typography>

            <Box component='form' noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
              <TextField
                margin='normal'
                required
                fullWidth
                id='name'
                label='Name'
                name='name'
                autoFocus
                onChange={event => setName(event.target.value)}
              />
              <TextField
                margin='normal'
                required
                fullWidth
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
                id='phone'
                label='Phone Number'
                name='phone'
                autoFocus
                onChange={event => setPhone(event.target.value)}
              />

              <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                Add Faculty
              </Button>
            </Box>
          </Box>
        </Container>
      </div>
    </Card>
  )
}

export default AddFacultyForm
