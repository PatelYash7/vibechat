import z from 'zod';
export const UserSchemaSignup = z
	.object({
		MobileNumber: z
			.string()
			.min(1, { message: 'Phone number Cannot be empty' })
			.refine(
				(value) => {
					const phoneRegex =
						/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/;
					return phoneRegex.test(value.replace(/[\s()-]/g, ''));
				},
				{ message: 'Invalid phone number Format' },
			),
		Name: z.string().min(1, { message: 'Name Cannot be Empty' }),
		Password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
				'Password must use UpperCase(A),LowerCase(a),digit(1) and special character(%)',
			),
		confirmPassword: z
			.string()
			.min(1, { message: 'Confirm Password is Required' }),
	})
	.refine((data) => data.Password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Passwords do not match',
	});
export type UserSchemaSignupType = z.infer<typeof UserSchemaSignup>;
export const UserSchemaSignin = z.object({
	MobileNumber: z
		.string()
		.min(1, { message: 'Phone number Cannot be empty' })
		.refine(
			(value) => {
				const phoneRegex =
					/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/;
				return phoneRegex.test(value.replace(/[\s()-]/g, ''));
			},
			{ message: 'Invalid phone number Format' },
		),
	Password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
			'Password must use UpperCase(A),LowerCase(a),digit(1) and special character(%)',
		),
});


export const CheckSignUp = z.object({
	type:z.enum(['signup']),
	name: z.string().min(1, "Name is required"),
	number: z
	  .string()
	  .regex(/^\d{10}$/, "Number must be a valid 10-digit phone number"),
	password: z
	  .string()
	  .min(8, "Password must be at least 8 characters long")
	  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
	  .regex(/[0-9]/, "Password must contain at least one number")
	  .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
	redirect: z
	  .union([z.literal("true"), z.literal("false")])
	  .transform((val) => val === "true"), // Transform to boolean
	csrfToken: z.string().min(1, "CSRF token is required"),
	callbackUrl: z.string().url("Callback URL must be a valid URL"),
	json: z
	  .union([z.literal("true"), z.literal("false")])
	  .transform((val) => val === "true"), // Transform to boolean
  });
  

  
export const CheckSignIn = z.object({
	type:z.enum(['signin']),
	number: z
	  .string()
	  .regex(/^\d{10}$/, "Number must be a valid 10-digit phone number"),
	password: z
	  .string()
	  .min(8, "Password must be at least 8 characters long")
	  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
	  .regex(/[0-9]/, "Password must contain at least one number")
	  .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
	redirect: z
	  .union([z.literal("true"), z.literal("false")])
	  .transform((val) => val === "true"), // Transform to boolean
	csrfToken: z.string().min(1, "CSRF token is required"),
	callbackUrl: z.string().url("Callback URL must be a valid URL"),
	json: z
	  .union([z.literal("true"), z.literal("false")])
	  .transform((val) => val === "true"), // Transform to boolean
  });
  
export type UserSchemaSigninType = z.infer<typeof UserSchemaSignin>;
