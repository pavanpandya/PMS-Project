import React, { useState, useEffect } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import { Button, Card } from '@mui/material'
import ReactiveButton from 'reactive-button'
import { deleteMember, getGroups } from 'src/@core/utils/ajax/student/studentGroups/group'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'

function Group() {
  const [userData, setUserData] = useState([])
  const [members, setMembers] = useState([])
  const [leaderEmail, setLeaderEmail] = useState('')
  const router = useRouter()

  let user_Id: string | null
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    user_Id = localStorage.getItem('email')
  }

  //show all accepted  project
  const fetchDetails = async () => {
    try {
      const data = await getGroups()
      setMembers(data)
      setUserData(data)
      console.log(data)
      setLeaderEmail(data[0].member1.leaderEmail)
      console.log('sabh sahi hai')
    } catch (error) {
      console.log('kuch  sahi nahi  hai')
      console.error(error)
    }
  }
  useEffect(() => {
    fetchDetails()
  }, [])

  // delete member
  const handleDelete = async (memberId: any) => {
    console.log(memberId)
    try {
      const data = await deleteMember({ memberId })
      console.log(data)
      toast.success('Member Deleted Successfully', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    } catch (error) {
      toast.error('Error While Deleteing Member', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      console.error(error)
    }
  }
  const memberArray = Object.values(members)

  let AssinedProject
  if (typeof window !== 'undefined') {
    AssinedProject = localStorage.getItem('projectIsAssigned')
  }

  return (
    <>
      {AssinedProject === 'no' ? (
        <Card sx={{ padding: 4 }}>
          Procject no created yet
          <Button onClick={() => router.push('/student/dashboard/home')}>Back to Home</Button>
        </Card>
      ) : (
        <Card sx={{ padding: 4 }}>
          {memberArray.length === 0 ? (
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          ) : (
            <div className='p-8'>
              {memberArray.map((member, index) => {
                const memberId = Object.keys(member)[0]
                const memberData = member[memberId]

                return (
                  <div key={memberId} className=' rounded-lg shadow-md  p-10 mr-4'>
                    <h2 className='text-lg font-bold   underline mb-4 p-2'>{memberData.name}</h2>
                    <p className='mb-2 p-2 text-lg'>Email : {memberData.email}</p>
                    <p className='mb-2 p-2 '>Enrollment Number : {memberData.enrollment_number}</p>

                    {user_Id === leaderEmail && index === 0 && <p className='mb-3 p-5 font-bold'></p>}

                    <div className='text-right'>
                      {user_Id === leaderEmail && index !== 0 ? (
                        <ReactiveButton
                          onClick={() => handleDelete(memberData._id)}
                          color='red'
                          idleText=' Delete Member'
                          loadingText='Loading'
                          successText='Done'
                          rounded={true}
                          shadow
                        />
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
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
        </Card>
      )}
    </>
  )
}

export default Group
