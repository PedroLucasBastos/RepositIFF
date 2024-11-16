const formTCC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Registro</h2>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Titulo"
          className="border p-2 rounded-md"
        />
        <textarea
          placeholder="Descrição"
          className="border p-2 rounded-md"
        ></textarea>
        <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">
          Salvar
        </button>
      </form>
    </div>
  );
};

export default formTCC;
