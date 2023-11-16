import clsx from "clsx"

const variants = {
  primary: "bg-blue-600 active:bg-blue-700 text-white",
  secondary: "bg-green-600 active:bg-green-700 text-white",
}
const sizes = {
  sm: "px-2 py-1.5 text-lg",
  md: "px-3 py-2 text-xl font-semibold",
}
const Button = (props) => {
  const { variant = "primary", size = "md", className, ...otherProps } = props

  return (
    <button
      className={clsx(variants[variant], sizes[size], className)}
      {...otherProps}
    />
  )
}

export default Button
