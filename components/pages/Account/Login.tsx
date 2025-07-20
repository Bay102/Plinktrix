import { useColorScheme } from 'react-native'

import { Controller, useForm } from 'react-hook-form'
import { TextInput as PaperTextInput } from 'react-native-paper'

import { Button } from '@/components/PaperBase/Button'
import { Text } from '@/components/PaperBase/Text'
import { TextInput } from '@/components/PaperBase/TextInput'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import MatrixButton from '@/components/shared/MatrixButton'
import { createTheme } from '@/constants/Colors'
import { login } from '@/supabase/api/login'

import PlinkoDigitalRain from '../../shared/PlinkoDigitalRain'

interface LoginFormData {
 email: string
 password: string
}

const Login = ({
 setFormMode,
}: {
 setFormMode: (mode: 'none' | 'login' | 'signup') => void
}) => {
 const colorScheme = useColorScheme()
 const theme = createTheme(colorScheme)

 const loginForm = useForm<LoginFormData>({
  defaultValues: {
   email: '',
   password: '',
  },
 })

 const onLoginSubmit = async (data: LoginFormData) => {
  try {
   const response = await login(data.email, data.password)

   if (response instanceof Error) {
    throw new Error(response.message)
   }
  } catch (error) {
   console.error(error)
  }
 }

 const resetForm = () => {
  setFormMode('none')
  loginForm.reset()
 }

 return (
  <ParallaxScrollView
   headerBackgroundColor={{
    light: theme.colors.matrixDarkBG,
    dark: theme.colors.surface,
   }}
   headerImage={<PlinkoDigitalRain />}
  >
   <Controller
    control={loginForm.control}
    name="email"
    rules={{
     required: 'Email is required',
     pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
     },
    }}
    render={({ field: { onChange, onBlur, value } }) => (
     <TextInput
      label="Email"
      mode="outlined"
      value={value}
      onChangeText={onChange}
      onBlur={onBlur}
      error={!!loginForm.formState.errors.email}
      left={<PaperTextInput.Icon icon="email" />}
      // @ts-ignore - React Native Paper doesn't have proper types for helperText
      helperText={loginForm.formState.errors.email?.message}
     />
    )}
   />

   <Controller
    control={loginForm.control}
    name="password"
    rules={{
     required: 'Password is required',
    }}
    render={({ field: { onChange, onBlur, value } }) => (
     <TextInput
      label="Password"
      mode="outlined"
      secureTextEntry
      value={value}
      onChangeText={onChange}
      onBlur={onBlur}
      error={!!loginForm.formState.errors.password}
      left={<PaperTextInput.Icon icon="lock" />}
      // @ts-ignore - React Native Paper doesn't have proper types for helperText
      helperText={loginForm.formState.errors.password?.message}
     />
    )}
   />

   <MatrixButton
    title="[ LOGIN ]"
    onPress={loginForm.handleSubmit(onLoginSubmit)}
    loading={loginForm.formState.isSubmitting}
    // disabled={loginForm.formState.isSubmitting}
   />

   {/* Dev Login */}
   <Button
    mode="elevated"
    onPress={() => {
     setFormMode('login')
     loginForm.setValue('email', 'dev@dev.com')
     loginForm.setValue('password', '00000000')
    }}
   >
    <Text>[ DEV LOGIN ]</Text>
   </Button>

   <Button onPress={resetForm}>Cancel</Button>
  </ParallaxScrollView>
 )
}

export default Login
