import ProductHeadline from "@/web/components/ProductHeadline"
import Pagination from "@/web/components/ui/Pagination"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { readResource, deleteResource } from "@/web/services/apiClient"
import { useRouter } from "next/router"
import Button from "@/web/components/ui/Button"
import { useSession } from "@/web/components/SessionContext"
import { useEffect } from "react"
import axios from "axios"

export const getServerSideProps = ({ query: { page } }) => ({
  props: {
    page: parseInt(page, 10) || 1,
  },
})
// eslint-disable-next-line max-lines-per-function
const DeletePage = ({ page }) => {
  const { session } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["products", page],
    queryFn: () => readResource("products", { params: { page } }),
  })

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
  const deleteMutation = useMutation({
    mutationFn: (productId) => deleteResource(`products/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["products", page])
    },
  })
  const handleDelete = async (productId) => {
    if (window.confirm.bind("Are you sure you want to delete this user?")) {
      await deleteMutation.mutateAsync(productId)
      window.location.reload()
    }
  }
  const handleEdit = (productId) => {
    router.push(`/products/edit?productId=${productId}`)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="py-4 flex flex-col gap-4">
      {data.data.result.map((product) => (
        <div key={product.id} className="bg-white p-4 rounded shadow-md">
          <ProductHeadline {...product} className="text-2xl font-bold" />
          <div className="flex gap-2">
            <Button
              onClick={() => handleEdit(product.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit
            </Button>
            <Button
              variant="delete"
              onClick={() => handleDelete(product.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
      <Pagination
        pathname="/products/list"
        page={page}
        countPages={data.data.meta.count}
        className="mt-4"
      />
    </div>
  )
}
export default DeletePage
