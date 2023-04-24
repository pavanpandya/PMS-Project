function Cards({ title, description, onClick }: any) {
  return (
    <div className='border rounded-lg p-4 cursor-pointer hover:shadow-md' onClick={onClick}>
      <h3 className='text-lg font-medium mb-2'>{title}</h3>
      <p className='text-gray-500'>{description}</p>
    </div>
  )
}
export default Cards
