//Página de cadastro de alunos

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, IdCard, Calendar, FileBadge, AtSign, ChevronDown, Building, MapPin, Home, Briefcase, HeartPulse } from 'lucide-react';
import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';
import api from '../../../services/api';

const StudentSignIn = () => {
    
    const [cadastroSucesso, setCadastroSucesso] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        user_data: {
            name_user: "",
            nasc_user: "",
            tipo_doc_user: "cpf",
            num_doc_user: "",
            lv_acesso: "aluno",
            tipo_email: "pessoal",
            email_user: "",
            fk_id_estudio: 1 
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
        extra_data: {
            profissao_user: "",
            historico_medico: ""
        }
    });

    const handleUserDataChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;
        if (name === 'num_doc_user') {
            finalValue = value.replace(/\D/g, ''); 
        }
        setFormData(prev => ({ ...prev, user_data: { ...prev.user_data, [name]: finalValue }}));
    };

    const handleEnderecoDataChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;
        if (name === 'cep') {
            finalValue = value.replace(/\D/g, ''); 
        }
        setFormData(prev => ({ ...prev, endereco_data: { ...prev.endereco_data, [name]: finalValue }}));
    };

    const handleContatoDataChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;
        if (name === 'numero_contato') {
            finalValue = value.replace(/\D/g, '');
        }
        setFormData(prev => ({ ...prev, contato_data: { ...prev.contato_data, [name]: finalValue }}));
    };

    const handleExtraDataChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, extra_data: { ...prev.extra_data, [name]: value }}));
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setMessage({ type: 'error', text: 'Usuário não autenticado.' });
            setIsLoading(false);
            return;
        }
        
        try {
            await api.post('/alunos/createAluno', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCadastroSucesso(true);
            setTimeout(() => navigate('/aluno/dashboard'), 1000);

        } catch (error) {
            const errorMessage = error.response?.data?.detail || "Erro ao cadastrar aluno.";
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
            <div className="flex flex-col items-center p-4 sm:p-8 bg-white rounded-lg shadow-md w-full">
                <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-40 mb-4" />

                <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">CADASTRO DE ALUNO</h2>
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
                        disabled={isLoading}
                    />
                </div>

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

                <div className="flex flex-col sm:flex-row w-full gap-4 mb-4">
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

                    <div className="flex items-center flex-grow p-2 border border-gray-300 rounded-md">
                        <IdCard className="text-gray-500 mr-2"/>
                        <input 
                            type="tel"
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
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="flex items-center flex-[1] p-2 border border-gray-300 rounded-md">
                        <div className="flex items-center text-gray-500 relative flex-shrink-0 w-full">
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

                <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <MapPin className="text-gray-500 mr-2"/>
                    <input 
                        type="text"
                        placeholder="Endereço (Rua, Nro, Bairro)"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                        name="endereco"
                        value={formData.endereco_data.endereco}
                        onChange={handleEnderecoDataChange}
                        disabled={isLoading}
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
                            disabled={isLoading}
                        />
                    </div>
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
                            <ChevronDown className="absolute right-0 top-1/2 -translatey-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <Briefcase className="text-gray-500 mr-2"/>
                    <input 
                        type="text"
                        placeholder="Profissão"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                        name="profissao_user"
                        value={formData.extra_data.profissao_user}
                        onChange={handleExtraDataChange}
                        disabled={isLoading}
                    />
                </div> 

                <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <HeartPulse className="text-gray-500 mr-2"/>
                    <input 
                        type="text"
                        placeholder="Histórico Médico (Opcional)"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                        name="historico_medico"
                        value={formData.extra_data.historico_medico}
                        onChange={handleExtraDataChange}
                        disabled={isLoading}
                    />
                </div> 

                <button 
                    type="submit"
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

export default StudentSignIn;