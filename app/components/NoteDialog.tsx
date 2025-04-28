import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DialogClose } from '@radix-ui/react-dialog';
import { Loader2, Plus } from 'lucide-react';
import React, { startTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Notes } from '@prisma/client';

type Props = {
	setNotes: React.Dispatch<React.SetStateAction<Notes[]>>;
	notes: Notes[];
	setCurrentNote: React.Dispatch<React.SetStateAction<Notes | null>>;
	setTempNotes: React.Dispatch<React.SetStateAction<Notes[]>>;
};

function NoteDialog({ setNotes, notes, setCurrentNote, setTempNotes }: Props) {
	const [input, setInput] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const router = useRouter();
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		const res = await fetch('/api/createNote', {
			method: 'POST',
			body: JSON.stringify({ name: input }),
		});
		const note = (await res.json()) as Notes;
		setIsLoading(false);
		note.createdAt = new Date(note.createdAt);
		setNotes([...notes, note]);
		setTempNotes([...notes, note]);
		setCurrentNote(note);

		setOpen(false);
		startTransition(() => {
			router.refresh();
		});
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<div
				className='flex justify-center items-center bg-primary rounded-sm h-10 cursor-pointer'
				onClick={() => setOpen(true)}
			>
				<Plus color='white'></Plus>
				<div className='text-white'>Agregar Nota</div>
			</div>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Agregar Nota</DialogTitle>
					<DialogDescription>Puedes crear una nueva nota dando click en el boton de abajo</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<h2 className='font-semibold text-sm'>Titulo de la nota</h2>
					<div className='h-3'></div>
					<Input value={input} placeholder='Titulo...' onChange={(e) => setInput(e.target.value)}></Input>
					<div className='h-5'></div>
					<div className='flex items-center gap-3'>
						<DialogClose>
							<Button type='reset' variant={'secondary'}>
								Cancelar
							</Button>
						</DialogClose>

						{isLoading ? (
							<Button disabled type='submit'>
								<Loader2 className='animate-spin w-4 h-4 mr-2' />
								Creando
							</Button>
						) : (
							<Button type='submit'>Crear</Button>
						)}	
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default NoteDialog;
