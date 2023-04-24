import { Box, Button, Modal, Card } from '@mui/material'

import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'

import LinearProgress from '@mui/material/LinearProgress'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
function customToolBar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}
const FacultyTab = () => {
  //table heading
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 250
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 250
    },
    {
      field: 'department',
      headerName: 'Department',
      minWidth: 250,
      sortable: false
    },
    {
      field: 'designation',
      headerName: 'Designation',
      minWidth: 250,
      sortable: false
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params: { row: any }) => {
        return (
          <>
            <Button
              onClick={() => handleEdit(params.row)}
              variant='contained'
              style={{ height: 35, width: 100, margin: 5 }}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(params.row)}
              variant='contained'
              color='error'
              style={{ height: 35, width: 100, margin: 5 }}
            >
              Delete
            </Button>
          </>
        )
      }
    }
  ]

  const handleClose = () => {
    setIsEditOpen(false)
  }
  const [selectedFacultyId, setSelectedFacultyId] = useState('')
  const [myArray, setMyArray] = useState([])
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [designation, setDesignation] = useState('')

  const [department, setDepartment] = useState('')
  const [loading, setLoading] = useState(false)

  let token: string | null
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    token = localStorage.getItem('token')
  }

  //handle get faculty
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      console.log(data)
      if (data && data.faculties) {
        setMyArray(data.faculties)
        setLoading(false)
      }
      console.log(myArray)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleSubmit()
  }, [])

  const handleUpdate = async (id: {
    selectedFacultyId: null
    email: string
    department: string
    name: string
    designation: string
  }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/update-faculty/${id.selectedFacultyId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            name: name,
            email: email,
            department: department,
            designation: designation
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await response.json()
      console.log(data)
      setIsEditOpen(false)
      setSelectedFacultyId('')
      if (data && data.faculty) {
        setMyArray(data.faculty)
      }
      if (response.status == 200) {
        toast.success('Faculty Updated', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
      } else {
        toast.error('Error in Update', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
      }
      handleSubmit()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id: { _id: any }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/delete-faculty/${id._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      console.log(data)
      if (data && data.faculty) {
        setMyArray(data.faculty)
      }
      if (response.status == 200) {
        toast.success('Faculty Deleted', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
      } else {
        toast.error('Error in Delete', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
      }
      handleSubmit()
    } catch (error) {
      console.error(error)
    }
  }
  const handleEdit = (faculty: {
    _id: React.SetStateAction<null>
    name: React.SetStateAction<string>
    email: React.SetStateAction<string>
    department: React.SetStateAction<string>
  }) => {
    setSelectedFacultyId(faculty._id)
    setName(faculty.name)
    setEmail(faculty.email)
    setDepartment(faculty.department)
    setIsEditOpen(true)
  }

  return (
    <div>
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
      <Card sx={{ padding: 4 }}>
        {loading ? (
          <Box sx={{ width: '100%' }}>
            <br></br>
            <div className='p-4'>
              <LinearProgress />
            </div>
            <br></br>
          </Box>
        ) : (
          <>
            <div className='min-h-1/2 flex-grow mx-2% shadow rounded-lg  p-4'>
              {isEditOpen && (
                <Modal
                  open={isEditOpen}
                  onClose={handleClose}
                  aria-labelledby='modal-modal-title'
                  aria-describedby='modal-modal-description'
                >
                  <Box sx={style}>
                    <div className='py-4'>
                      <label className='block mb-2  font-bold'>Faculty ID</label>
                      <label className='block mb-2 text-gray-600'>{selectedFacultyId}</label>
                      <label className='block mb-2  font-bold'>Faculty Name</label>
                      <input
                        className='w-full mb-2 py-2 px-3 rounded border border-gray-300 bg-transparent  focus:outline-none focus:border-indigo-500'
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                      <label className='block mb-2  font-bold'>Faculty Email</label>
                      <input
                        className='w-full mb-2 py-2 px-3 rounded border border-gray-300 bg-transparent  focus:outline-none focus:border-indigo-500'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                      <label className='block mb-2  font-bold'>Faculty department</label>
                      <input
                        className='w-full mb-2 py-2 px-3 rounded border border-gray-300 bg-transparent focus:outline-none focus:border-indigo-500'
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                      />
                      <label className='block mb-2  font-bold'>Designation</label>
                      <input
                        className='w-full mb-2 py-2 px-3 rounded border border-gray-300 bg-transparent focus:outline-none focus:border-indigo-500'
                        value={designation}
                        onChange={e => setDesignation(e.target.value)}
                      />

                      <div className='flex justify-end'>
                        <button
                          className='mr-2 px-4 py-2 bg-gray-200 font-bold text-black rounded-lg hover:bg-blue-600'
                          onClick={() => setIsEditOpen(false)}
                        >
                          Close
                        </button>
                        <button
                          className='px-4 py-2 bg-gray-200 font-bold text-black rounded-lg hover:bg-blue-600'
                          onClick={() => handleUpdate({ selectedFacultyId, email, department, name, designation })}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </Box>
                </Modal>
              )}
              {myArray.length > 0 && (
                <div style={{ height: 450, width: 1300, left: 100, top: 100 }}>
                  <DataGrid
                    columns={columns}
                    rows={myArray}
                    getRowId={d => d._id}
                    pageSize={5}
                    disableSelectionOnClick
                    checkboxSelection
                    components={
                      {
                        Toolbar: customToolBar
                      }

                      // checkboxSelection
                      // disableSelectionOnClick
                    }
                  />
                </div>
              )}
              <br />
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default FacultyTab
