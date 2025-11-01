import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, IdCard, GraduationCap, FileBadge, MapPin, Building,  Home, ChevronDown, AtSign, Calendar} from 'lucide-react';
import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';
import DateInput from "../../../components/forms/DateInput";
import api from '../../../services/api'; 

const InstructorSignIn = () => {
    //const [documentType, setDocumentType] = useState('CREF');
    const [cadastroSucesso, setCadastroSucesso] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        user_data:{
            name_user: "",
            nasc_user: "",
            tipo_doc_user: "cpf",
            num_doc_user: "",
            lv_acesso: "instrutor",
            tipo_email: "comercial",
            email_user: "",
            fk_id_estudio: 1,
        },
        senha_user: "",
        endereco_data: {
            tipo_endereco: "residencial",
            endereco: "",
            cep: ""
        },
        contato_data: {
            tipo_contato: "residencial",
            numero_contato: ""
        },
        tipo_especializacao: "cref",
        numero_de_registro: "",
        formacao: "",
        data_contratacao: ""
    });

    const handleUserDataChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;
        if (name === 'num_doc_user') {
            finalValue = value.replace(/\D/g, ''); 
        }

        setFormData(prev => ({
            ...prev,
            user_data: { ...prev.user_data, [name]: finalValue }
        }));
    };

    const handleEnderecoDataChange = (e) => {
        const { name, value } = e.target;
        if (name === 'cep') {
            const numericValue = value.replace(/\D/g, ''); 
            setFormData(prev => ({
                ...prev,
                endereco_data: { ...prev.endereco_data, cep: numericValue }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                endereco_data: { ...prev.endereco_data, [name]: value }
            }));
        }
    };     

    const handleContatoDataChange = (e) => {      
        const { name, value } = e.target;
        
        let finalValue = value;
        if (name === 'numero_contato') {
            finalValue = value.replace(/\D/g, ''); // Remove não-números
        }

        setFormData(prev => ({
            ...prev,
            contato_data: { ...prev.contato_data, [name]: finalValue }
        }));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const token = localStorage.getItem('accessToken');
        // console.log(token)
        if (!token) {
            setMessage({ type: 'error', text: 'Usuário não autenticado.' });
            setIsLoading(false);
            return;
        }
        
        try {
            await api.post('/instrutores/createInstrutor', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCadastroSucesso(true);
            setTimeout(() => navigate('/aluno/dashboard'), 1000); 

        } catch (error) {
            const errorMessage = error.response?.data?.detail || "Erro ao cadastrar instrutor.";
            setMessage({ text: errorMessage, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessage = () => {
        if (!message) return null;
        const messageClasses = message.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-500 text-white';
        return (
            <div className={`w-full p-3 my-4 rounded-md text-center ${messageClasses}`}>
                {message.text}
            </div>
        );
    };

    if(cadastroSucesso) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-bismark-800">
                <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-96">
                    <div className="flex items-center justify-center p-8 bg-blumine-900 rounded-md">
                        <h2 className="text-xl font-bold text-white text-center">
                            NOVO USUÁRIO CADASTRADO COM SUCESSO!
                        </h2>
                    </div>
                </div>
            </div>
        )
    }

    return ( 
    <div className="flex flex-col items-center justify-center min-h-screen bg-bismark-800 p-4">

        <form onSubmit={handlesubmit} className="w-full max-w-md">
        {/*<form onSubmit={handlesubmit} className="w-full max-w-wd"> {/**large screen formulario real XD, na minha opnião*/}

        <div className="flex flex-col items-center p-4 sm:p-8 bg-white rounded-lg shadow-md w-full"> 
            <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-40 mb-4" />

            <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">CADASTRO DE INSTRUTOR</h2>
            {renderMessage()}
            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <User className="text-gray-500 mr-2"/>
                <input 
                    type="text" 
                    placeholder="Nome Completo"
                    className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    name="name_user"
                    value={formData.user_data.name_user}
                    onChange={handleUserDataChange}
                    required disabled={isLoading}
                />
            </div>
            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <Calendar className="text-gray-500 mr-2"/>
                <input 
                    type="text" 
                    placeholder="Data de Nascimento"
                    className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    name="nasc_user"
                    value={formData.user_data.nasc_user}
                    onChange={handleUserDataChange}
                    onFocus={(e) => e.target.type = 'date'}
                    onBlur={(e) => e.target.type = 'text'}
                    required disabled={isLoading}
                />
            </div>

             {/*INtrodução de novo imput de !"tipo de email //enum pesssoal ou comercial"  */}
            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <div className="flex items-center text-gray-500 relative flex-shrink-0">
                    <AtSign className="w-5 h-5 mr-2" />
                    <select
                        name="tipo_email"
                        value={formData.user_data.tipo_email}
                        onChange={handleUserDataChange}
                        className="bg-transparent border-none outline-none appearance-none pr-6"
                        disabled={isLoading}
                    >
                        <option value="pessoal">Email Pessoal</option>
                        <option value="comercial">Email Comercial</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
            </div>


            <div className="flex flex-col sm:flex-row w-full gap-4 mb-4">
                <div className="flex items-center flex-1 p-2 border border-gray-300 rounded-md">
                    <Mail className="text-gray-500 mr-2"/>
                    <input 
                        type="email" 
                        placeholder="Email"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700 w-full"
                        name="email_user"
                        value={formData.user_data.email_user}
                        onChange={handleUserDataChange}
                        required disabled={isLoading}
                    />
                </div>
                <div className="flex items-center flex-1 p-2 border border-gray-300 rounded-md">
                    <Lock className="text-gray-500 mr-2"/>
                    <input 
                        type="password"
                        placeholder="Senha" 
                        className="flex-grow outline-none border-none bg-transparent text-gray-700 w-full"
                        name="senha_user"
                        value={formData.senha_user}
                        onChange={(e) => setFormData(prev => ({ ...prev, senha_user: e.target.value }))}
                        required disabled={isLoading}
                    />
                </div>
            </div>
            
            {/* NOvo imput de tipo de docuemnto//enum cpf ou cnpj */}
            
            <div className="flex flex-col sm:flex-row w-full gap-4 mb-4">
                {/* Instrudução tipo_doc_user(cpf ou cnpj) Select Tipo de Documento (novo) */}
                <div className="flex items-center flex-grow-0 p-2 border border-gray-300 rounded-md">
                    <div className="flex items-center text-gray-500 relative flex-shrink-0">
                        <FileBadge className="w-5 h-5 mr-2" />
                        <select
                            name="tipo_doc_user"
                        
                            value={formData.user_data.tipo_doc_user}
                            onChange={handleUserDataChange}
                            className="bg-transparent border-none outline-none appearance-none pr-6"
                            disabled={isLoading}
                        >
                            <option value="cpf">CPF</option>
                            <option value="cnpj">CNPJ</option>
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>


                {/* Campo Número de Registro (agora 'num_doc_user') */}
                <div className="flex items-center flex-grow p-2 border border-gray-300 rounded-md">
                    <FileBadge className="text-gray-500 mr-2"/>
                    <input 
                        type="text"
                        placeholder={formData.user_data.tipo_doc_user === 'cpf' ? "Número do CPF" : "Número do CNPJ"}
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                        name="num_doc_user"
                        value={formData.user_data.num_doc_user}
                        onChange={handleUserDataChange}
                        maxLength={formData.user_data.tipo_doc_user === 'cpf' ? 11 : 14}
                        required disabled={isLoading}
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row w-full gap-4 mb-4">
                <div className="flex items-center flex-[2] p-2 border border-gray-300 rounded-md">
                    <Phone className="text-gray-500 mr-2"/>
                    <input 
                        type="tel"
                        placeholder="Número de Contato"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                        name="numero_contato"
                        value={formData.contato_data.numero_contato}
                        onChange={handleContatoDataChange}
                        required disabled={isLoading}
                    />
                </div>

                
                <div className="flex items-center flex-[1] p-2 border border-gray-300 rounded-md">
                    <div className="flex items-center text-gray-500 relative flex-shrink-0 w-full">
                        {/* <Phone className="w-5 h-5 mr-2" /> */}
                        <select
                            name="tipo_contato"
                            value={formData.contato_data.tipo_contato}
                            onChange={handleContatoDataChange}
                            className="bg-transparent border-none outline-none appearance-none w-full pr-6"
                            disabled={isLoading}
                        >
                            <option value="residencial">Residencial</option>
                            <option value="comercial">Comercial</option>
                            <option value="familiar">Familiar</option>
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row w-full gap-4 mb-4">
                <div className="flex items-center flex-1 p-2 border border-gray-300 rounded-md">
                    <div className="flex items-center text-gray-500 relative flex-shrink-0">
                        <Building className="w-5 h-5 mr-2" />
                        <select
                            name="fk_id_estudio"
                            value={Number(formData.user_data.fk_id_estudio)}
                            onChange={handleUserDataChange}
                            className="bg-transparent border-none outline-none appearance-none pr-6"
                            disabled={isLoading}
                        >
                            <option value={1}>Estúdio Itaquera</option>
                            <option value={2}>Estúdio São Miguel</option>
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Introdução de novo imput para endereço */}
            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <MapPin className="text-gray-500 mr-2"/>
                <input 
                    type="text"
                    placeholder="Endereço (Rua, Nro, Bairro)"
                    className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    name="endereco"
                    value={formData.endereco_data.endereco}
                    onChange={handleEnderecoDataChange}
                    required disabled={isLoading}
                />
            </div>
            
            <div className="flex flex-col sm:flex-row w-full gap-4 mb-4">
                <div className="flex items-center flex-grow p-2 border border-gray-300 rounded-md">
                    <MapPin className="text-gray-500 mr-2"/>
                    <input 
                        type="tel"
                        placeholder="CEP (só números)"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700 w-full"
                        name="cep"
                        value={formData.endereco_data.cep}
                        onChange={handleEnderecoDataChange}
                        maxLength={8}
                        required disabled={isLoading}
                    />
                </div>
                {/* CORREÇÃO: Layout 'flex-grow-0' para o select */}
                <div className="flex items-center flex-grow-0 p-2 border border-gray-300 rounded-md">
                    <div className="flex items-center text-gray-500 relative flex-shrink-0">
                        <Home className="w-5 h-5 mr-2" />
                        <select
                            name="tipo_endereco"
                            value={formData.endereco_data.tipo_endereco}
                            onChange={handleEnderecoDataChange}
                            className="bg-transparent border-none outline-none appearance-none pr-6"
                            disabled={isLoading}
                        >
                            <option value="residencial">Residencial</option>
                            <option value="comercial">Comercial</option>
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row w-full gap-4 mb-4">
                <div className="flex items-center flex-grow-0 p-2 border border-gray-300 rounded-md">
                    <div className="flex items-center text-gray-500 relative flex-shrink-0">
                        <FileBadge className="w-5 h-5 mr-2" />
                        <select
                            name="tipo_especializacao"
                            value={formData.tipo_especializacao}
                            onChange={handleFormChange}
                            className="bg-transparent border-none outline-none appearance-none pr-6"
                            disabled={isLoading}
                        >
                            <option value="cref">CREF</option>
                            <option value="crefita">CREFITA</option>
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                <div className="flex items-center flex-grow p-2 border border-gray-300 rounded-md">
                    <FileBadge className="text-gray-500 mr-2"/>
                    <input 
                        type="text"
                        placeholder={formData.tipo_especializacao === 'cref' ? "Número do CREF" : "Número do CREFITA"}
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                        name="numero_de_registro" 
                        value={formData.numero_de_registro} 
                        onChange={handleFormChange} 
                        maxLength={formData.tipo_especializacao === 'cref' ? 11 : 14}
                        required disabled={isLoading}
                    />
                </div>
            </div>

            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <GraduationCap className="text-gray-500 mr-2"/>
                <input 
                    type="text"
                    placeholder="Formação"
                    className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    name="formacao"
                    value={formData.formacao}
                    onChange={handleFormChange}
                    required disabled={isLoading}
                />
            </div>      

            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <Calendar className="text-gray-500 mr-2"/>
                <input 
                    type="text" 
                    placeholder="Data de Contratação"
                    className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    name="data_contratacao"
                    value={formData.data_contratacao}
                    onChange={handleFormChange}
                    onFocus={(e) => e.target.type = 'date'}
                    onBlur={(e) => e.target.type = 'text'}
                    required disabled={isLoading}
                />
            </div>


            <button type="submit" 
            className="w-full py-3 bg-blumine-900 text-white font-bold rounded-md hover:bg-blumine-950 transition-colors duration-300 disabled:opacity-75"
            disabled={isLoading}
            >
                {isLoading ? 'SALVANDO...' : 'SALVAR'}
            </button>
        </div>
        </form>
    </div>
  );
};

export default InstructorSignIn;