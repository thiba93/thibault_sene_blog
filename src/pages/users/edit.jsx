/* eslint-disable max-lines-per-function */
import React, { useEffect, useState } from "react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormField from "@/web/components/ui/FormField"
import SubmitButton from "@/web/components/ui/SubmitButton"
import { useRouter } from "next/router"
import axios from "axios"
import { useSession } from "@/web/components/SessionContext"

const EditUser = () => {
  const { session } = useSession()
  const router = useRouter()
  const [ setError] = useState("")


  useEffect(() => {
    if (!session) {
      router.push("/")
    }

    const fetchConnectedUser = async () => {
      const response = await axios.get(`/api/users/${session?.user.id}`)

      if (
        response.data.result[0].role === "user" ||
        response.data.result[0].isEnabled === "disabled"
      ) {
        router.push("/")
      }
    }

    fetchConnectedUser()
  }, [router, session])
  const { userId } = router.query
  const [initialValues, setInitialValues] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`/api/users/${userId}`)
      setInitialValues({
        email: response.data.result[0].email,
        password: "",
      })
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  })
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.put(`/api/users/${userId}`, values)

      router.push("/users/list")
    } catch (error) {
      setError("User update failed")
    }

    setSubmitting(false)
  }

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <FormField name="email" type="email" label="Email" />
            <FormField name="password" type="password" label="Password" />
            <SubmitButton
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update User
            </SubmitButton>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default EditUser
