

const AuthLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className="bg-red-500 h-[100%]">
     {children}
    </div>
  )
}

export default AuthLayout;