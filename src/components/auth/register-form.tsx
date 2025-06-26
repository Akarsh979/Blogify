import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { signUp } from '@/lib/auth-client';
import { toast } from 'sonner';

const registerSchema = z.object({
   name: z.string().min(1,"Name is required"),
   email: z.string().email("Please enter a valid email address"),
   password: z.string().min(6,"Password must be at least 6 characters long"),
   confirmPassword: z.string().min(6,"Password must be at least 6 characters long")
}).refine(data => data.password === data.confirmPassword,{
   message: "Passwords do not match",
   path: ['confirmPassword']
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps{
   onSuccess? : () => void
}

function RegisterForm({onSuccess}:RegisterFormProps){
   const [isLoading,setIsLoading] = useState(false);

   const form = useForm<RegisterFormValues>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
         name: '',
         email: '',
         password: '',
         confirmPassword: ''
      }
   });

   async function onSubmitHandler(values:RegisterFormValues){
     setIsLoading(true);
     try {
      const {data,error} = await signUp.email({
         email: values.email,
         password: values.password,
         name: values.name,
      })
      
      if(error){
         toast('Failed to create account. Please try again');
         setIsLoading(false);
         return;
      }
      console.log(data);
      
      toast('Your account has been successfully created. Please sign in with email and password');

      if(onSuccess){
         onSuccess();
      }
     } catch (error) {
       console.log(error);
     } finally{
       setIsLoading(false);
     }
   };   

   return (
      <Form {...form}> 
       <form onSubmit={form.handleSubmit(onSubmitHandler)} className='space-y-4'>
       
       <FormField
       control={form.control}
       name='name'
       render={({field})=>(
         <FormItem>
         <FormLabel>Name</FormLabel>
         <FormControl>
         <Input placeholder='Enter your name' {...field}/>
         </FormControl>
         <FormMessage/>
         </FormItem>
       )}       
       />

       <FormField
       control={form.control}
       name='email'
       render={({field})=>(
         <FormItem>
         <FormLabel>Email</FormLabel>
         <FormControl>
         <Input placeholder='Enter your email' {...field}/>
         </FormControl>
         <FormMessage/>
         </FormItem>
       )}       
       /> 

       <FormField
       control={form.control}
       name='password'
       render={({field})=>(
         <FormItem>
         <FormLabel>Password</FormLabel>
         <FormControl>
         <Input type='password' placeholder='Enter your password' {...field}/>
         </FormControl>
         <FormMessage/>
         </FormItem>
       )}       
       />  

      <FormField
       control={form.control}
       name='confirmPassword'
       render={({field})=>(
         <FormItem>
         <FormLabel>Confirm Password</FormLabel>
         <FormControl>
         <Input type='password' placeholder='Enter your password again' {...field}/>
         </FormControl>
         <FormMessage/>
         </FormItem>
       )}       
       />  

       <Button type='submit' className='w-full' disabled={isLoading}> 
         {isLoading ? "Creating Account..." : "Create Account"}
      </Button>         

       </form>
      </Form>
   )
}

export default RegisterForm;