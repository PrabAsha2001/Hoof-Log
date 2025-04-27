import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import InputBox from '../components/InputBox'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

// Lucide icons
import {
  BadgeDollarSign,
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  Lock,
} from 'lucide-react'

export const SignUpPage = () => {
  const navigate = useNavigate()
  const { signup } = useAuthStore()

  const formik = useFormik({
    initialValues: {
      stableID: '',
      stableName: '',
      ownerName: '',
      address: '',
      ownerPhoneNumber: '',
      ownerEmail: '',
      password: '',
    },
    validationSchema: Yup.object({
      stableID: Yup.string().required('Stable ID is required'),
      stableName: Yup.string().required('Stable Name is required'),
      ownerName: Yup.string().required('Owner Name is required'),
      address: Yup.string().required('Address is required'),
      ownerPhoneNumber: Yup.string().required('Phone Number is required'),
      ownerEmail: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await signup(values) // updated to pass the full object
        toast.success('Signup successful! Please check your email for verification.')
        navigate('/verify-email')
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Signup failed.')
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
      <form onSubmit={formik.handleSubmit}>
        <InputBox
          icon={BadgeDollarSign}
          type="text"
          name="stableID"
          placeholder="Stable ID"
          {...formik.getFieldProps('stableID')}
        />
        {formik.touched.stableID && formik.errors.stableID && (
          <div className="text-red-500 text-sm">{formik.errors.stableID}</div>
        )}

        <InputBox
          icon={Building2}
          type="text"
          name="stableName"
          placeholder="Stable Name"
          {...formik.getFieldProps('stableName')}
        />
        {formik.touched.stableName && formik.errors.stableName && (
          <div className="text-red-500 text-sm">{formik.errors.stableName}</div>
        )}

        <InputBox
          icon={User}
          type="text"
          name="ownerName"
          placeholder="Owner Name"
          {...formik.getFieldProps('ownerName')}
        />
        {formik.touched.ownerName && formik.errors.ownerName && (
          <div className="text-red-500 text-sm">{formik.errors.ownerName}</div>
        )}

        <InputBox
          icon={MapPin}
          type="text"
          name="address"
          placeholder="Address"
          {...formik.getFieldProps('address')}
        />
        {formik.touched.address && formik.errors.address && (
          <div className="text-red-500 text-sm">{formik.errors.address}</div>
        )}

        <InputBox
          icon={Phone}
          type="text"
          name="ownerPhoneNumber"
          placeholder="Phone Number"
          {...formik.getFieldProps('ownerPhoneNumber')}
        />
        {formik.touched.ownerPhoneNumber && formik.errors.ownerPhoneNumber && (
          <div className="text-red-500 text-sm">{formik.errors.ownerPhoneNumber}</div>
        )}

        <InputBox
          icon={Mail}
          type="email"
          name="ownerEmail"
          placeholder="Email"
          {...formik.getFieldProps('ownerEmail')}
        />
        {formik.touched.ownerEmail && formik.errors.ownerEmail && (
          <div className="text-red-500 text-sm">{formik.errors.ownerEmail}</div>
        )}

        <InputBox
          icon={Lock}
          type="password"
          name="password"
          placeholder="Password"
          {...formik.getFieldProps('password')}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500 text-sm">{formik.errors.password}</div>
        )}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          {formik.isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-4 text-center">
        Already have an account?{' '}
        <a href="/login" className="text-blue-500">
          Login
        </a>
      </p>
    </div>
  )
}
