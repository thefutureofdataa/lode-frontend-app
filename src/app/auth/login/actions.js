"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/app/utils/supabase/server.js"

export async function login(email, password) {
	const supabase = await createClient()

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email,
		password,
	}

	const { error } = await supabase.auth.signInWithPassword(data)

	if (error) {
		console.log(error)
		redirect(`/error?reason=${error.code}`)
	}

	revalidatePath("/", "layout")
	redirect("/")
}

export async function signup(formData) {
	const supabase = await createClient()

	const data = {
		email: formData.get("email"),
		password: formData.get("password"),
	}

	const { data: user, error } = await supabase.auth.signUp(data)

	if (user) {
		const { error: whitelistError } = await supabase.from("allowed_users").insert([
			{
				email: user.email,
				created_at: new Date().toISOString(),
				signup_method: "email_password",
			},
		])

		if (whitelistError) {
			console.error("Failed to add user to whitelist:", whitelistError)
			// TODO: handle this error appropriately
		}
	}

	if (error) {
		redirect(`/error?reason=${error.code}`)
	}

	revalidatePath("/", "layout")
	redirect("/")
}
