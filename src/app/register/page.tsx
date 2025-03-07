import RegisterForm from "@/components/RegisterForm";

export default function Home() {
  return (
    <div className="bg-gradient-to-l from-slate-800 to-slate-600 min-h-screen w-full flex flex-col items-center justify-center">
      <h1 className="font-bold text-[2rem] text-white">Cadastro</h1>
      <p className="text-white font-semibold ">Assine nossa Newsletter e mantenha-se informado</p>
      <div className="w-96 mt-4 bg-stone-200 px-4 py-5 rounded-xl 5">
        <RegisterForm />
      </div>
      <p className="text-slate-100 text-xs w-96 mt-2 text-center font-semibold">Ao se inscrever você passará a receber os nossos e-mais com as melhores dicas, novidades e ofertas.
      </p>
    </div>


  );
}