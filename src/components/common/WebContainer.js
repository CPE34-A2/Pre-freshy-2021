export default function WebContainer(props) {
  return (
    <div className="flex flex-col h-screen justify-between">
      {props.children}
    </div>
  )
}