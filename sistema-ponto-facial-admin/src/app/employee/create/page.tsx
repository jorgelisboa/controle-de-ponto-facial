'use client'

import { Form, Input, Button, FormProps, Card, Alert } from 'antd';
import { useState } from 'react';

type EmployeeCreateType = {
  fullName: string;
  document: string;
  role: string;
  hourlyValue: number;
  monthlyHours: number;
}

export default function EmployeeCreate() {
  const [successAlert, setSuccessAlert] = useState(false)
  const [errorAlert, setErrorAlert] = useState(false)

  const onFinishSimple: FormProps<EmployeeCreateType>['onFinish'] = (values: EmployeeCreateType) => {
    fetch(process.env.API_URL + '/api/collaborators', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': "application/json",
      },
      body: JSON.stringify(values),
    }).then((response) => {
      if (response.status === 201) {
        setSuccessAlert(true)
      } else {
        setErrorAlert(true)
      }
    })
  }

  return (
    <div className="h-screen">
      <div className="
        flex
        items-center
        justify-center
        h-screen
        flex-col
      ">
        {
        successAlert ? 
        <Alert 
          message="Funcionário Cadastrado com Sucesso!" 
          type="success" 
          closable 
          className='
            w-2/5
          '
        /> : null
        }
        
        { errorAlert ?
        <Alert 
          message="Erro ao cadastrar Funcionário!" 
          type="error" 
          closable 
          className='
            w-2/5
          '
        /> : null
        }
        <Card title="Criar novo funcionário"
          className='
            w-2/5
          '
        >
          
          <Form 
            autoComplete='off'
            onFinish={onFinishSimple}
          >
            <Form.Item<EmployeeCreateType>
              label='Nome completo'
              name='fullName'
              rules={[{ required: true, message: 'Por favor, insira o nome completo' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<EmployeeCreateType>
              label='Documento'
              name='document'
              rules={[{ required: true, message: 'Por favor, insira o documento' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<EmployeeCreateType>
              label='Cargo'
              name='role'
              rules={[{ required: true, message: 'Por favor, insira o cargo' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<EmployeeCreateType>
              label='Valor da hora'
              name='hourlyValue'
              rules={[{ required: true, message: 'Por favor, insira o valor da hora' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<EmployeeCreateType>
              label='Horas mensais'
              name='monthlyHours'
              rules={[{ required: true, message: 'Por favor, insira as horas mensais' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Salvar
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}