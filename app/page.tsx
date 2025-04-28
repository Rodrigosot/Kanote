import React from 'react';
import { Navbar } from './components/NavBar';
import { Button } from '@/components/ui/button';
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
	const { isAuthenticated } = getKindeServerSession();

	if (await isAuthenticated()) {
		return redirect('/dashboard');
	}

	return (
		<div>
			<Navbar />
			<section className='flex items-center justify-center bg-background h-[80vh]'>
				<div className='relative items-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7xl md:px-12'>
					<div className='max-w-3xl mx-auto text-center'>
						<h1 className='mt-8 text-5xl font-semibold tracking-tight lg:text-7xl'>Gestión de tareas y notas</h1>
						<p className='mt-8 text-xl text-gray-500'>Crea tus notas y tareas facilmente con nuestra aplicacion web</p>
						<div className='mt-8'>
							<RegisterLink>
								<Button>Comenzar gratis</Button>
							</RegisterLink>
						</div>
						<div className='mt-5'></div>
					</div>
				</div>
			</section>
		</div>
	);
}
