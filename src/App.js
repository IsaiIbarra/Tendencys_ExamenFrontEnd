import React, { useState, useEffect } from 'react';
import CheckImage from './assets/images/system/circle-check.png';
import {
  CRow,
  CCol,
  CCollapse,
  CCard,
  CCardHeader,
  CCardBody,
  CListGroup,
  CListGroupItem,
  CSpinner,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CImage,
} from '@coreui/react';
import { CSmartTable } from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import {
  cilBox,
  cilCheckCircle,
  cilCreditCard,
  cilDollar,
  cilEye,
  cilEyeSlash,
  cilKey,
  cilPlusCircle,
  cilSave,
  cilTag,
  cilX,
} from '@coreui/icons-pro';

function App() {
  //Para validar la carga de los datos de la API
  const [cargando, setCargando] = useState(true);

  //Para guardar las ordenes provenientes de la API
  const [ordenesCompra, setOrdenesCompra] = useState();

  //Para mostrar los detalles de cada orden
  const [detalles, setDetalles] = useState([]);

  //Para mostrar la ventana modal de agregar producto
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);

  //Para mostrar la ventana modal de pago realizado
  const [mostrarModalPago, setMostrarModalPago] = useState(false);

  //Para guardar el index de la orden a la cual agregaremos productos o la cual pagaremos
  const [IndexOrdenSeleccionada, setIndexOrdenSeleccionada] = useState(0);

  //Columnas de la tabla
  const columns = [
    {
      key: 'number',
      label: 'Número de orden',
      filter: false,
      sorter: false,
    },
    {
      key: 'acciones',
      label: '',
      filter: false,
      sorter: false,
    },
  ];

  //Para guardar el index de la orden de la cual queremos saber sus detalles
  const toggleDetails = (index) => {
    const position = detalles.indexOf(index);
    let nuevoDetalle = detalles.slice();
    if (position !== -1) {
      nuevoDetalle.splice(position, 1);
    } else {
      nuevoDetalle = [...detalles, index];
    }
    setDetalles(nuevoDetalle);
  };

  //Función para un agregar producto a una orden
  const agregarProducto = (e) => {
    e.preventDefault();

    let nuevoProducto = {
      sku: e.target.sku.value,
      name: e.target.name.value,
      quantity: e.target.quantity.value,
      price: e.target.price.value,
    };

    ordenesCompra[IndexOrdenSeleccionada].items.push(nuevoProducto);
    console.log(nuevoProducto);

    setMostrarModalAgregar(false);
  };

  //API para obtener las ordenes de compra
  const getOrdenesCompra = () => {
    fetch('https://eshop-deve.herokuapp.com/api/v2/orders', {
      method: 'GET',
      headers: {
        Authorization:
          'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwUGFINU55VXRxTUkzMDZtajdZVHdHV3JIZE81cWxmaCIsImlhdCI6MTYyMDY2Mjk4NjIwM30.lhfzSXW9_TC67SdDKyDbMOYiYsKuSk6bG6XDE1wz2OL4Tq0Og9NbLMhb0LUtmrgzfWiTrqAFfnPldd8QzWvgVQ',
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.success) {
          //Guardamos las ordenes
          setOrdenesCompra(resp.orders);
          //Dejamos de mostrar la carga
          setCargando(false);
        }
      })
      .catch((e) => {
        console.warn(e);
      });
  };

  useEffect(() => {
    getOrdenesCompra();
  }, []);

  return (
    <CRow className='justify-content-center mt-5'>
      <CCol sm={8}>
        {/* Validador de carga */}
        {cargando ? (
          <CCard className='text-center'>
            <CCardHeader>Cargando...</CCardHeader>
            <CCardBody>
              <CSpinner />
            </CCardBody>
          </CCard>
        ) : (
          <>
            <CCard>
              <CCardHeader className='text-center'>
                Órdenes de compra
              </CCardHeader>
              <CCardBody>
                {/* Tabla para visualizar las ordenes de compra */}
                <CSmartTable
                  activePage={1}
                  columns={columns}
                  items={ordenesCompra}
                  itemsPerPageSelect
                  itemsPerPage={10}
                  pagination
                  scopedColumns={{
                    acciones: (item) => {
                      return (
                        <>
                          <td className='text-end border-0'>
                            {/* Boton para ver detalles de la orden */}
                            <CButton
                              color='primary'
                              className='me-2'
                              shape='square'
                              size='sm'
                              title='Detalles de la orden'
                              onClick={() => {
                                toggleDetails(item.id);
                              }}
                            >
                              <CIcon
                                icon={
                                  detalles.includes(item.id)
                                    ? cilEyeSlash
                                    : cilEye
                                }
                              />{' '}
                              Detalles
                            </CButton>
                            {/* Boton para pagar la orden */}
                            <CButton
                              color='warning'
                              className='me-1'
                              shape='square'
                              size='sm'
                              title='Pagar orden'
                              onClick={() => {
                                setMostrarModalPago(true);
                                setIndexOrdenSeleccionada(
                                  ordenesCompra
                                    .map((object) => object.id)
                                    .indexOf(item.id)
                                );
                              }}
                            >
                              <CIcon icon={cilCreditCard} /> Pagar
                            </CButton>
                          </td>
                        </>
                      );
                    },
                    details: (item) => {
                      return (
                        <CCollapse visible={detalles.includes(item.id)}>
                          {/* Mostrar los detalles de la orden */}
                          <CCardBody>
                            Productos de la orden <b>{item.number}</b>
                            <CListGroup className='mt-2'>
                              {/* Listado de productos */}
                              {item.items.map((prod, index) => {
                                return (
                                  <CListGroupItem key={index}>
                                    <b>SKU: </b> {prod.sku}
                                    <br />
                                    <b>Nombre: </b> {prod.name}
                                    <br />
                                    <b>Cantidad: </b> {prod.quantity}{' '}
                                    articulo(s)
                                    <br />
                                    <b>Precio: </b> ${prod.price}
                                  </CListGroupItem>
                                );
                              })}

                              {/* Boton para agregar producto a la orden */}
                              <CButton
                                color='success'
                                className='my-2'
                                onClick={() => {
                                  setMostrarModalAgregar(true);
                                  setIndexOrdenSeleccionada(
                                    ordenesCompra
                                      .map((object) => object.id)
                                      .indexOf(item.id)
                                  );

                                  console.log(item);
                                }}
                              >
                                <CIcon icon={cilPlusCircle} /> Agregar Producto
                              </CButton>
                            </CListGroup>
                          </CCardBody>
                        </CCollapse>
                      );
                    },
                  }}
                  tableProps={{
                    striped: true,
                    hover: true,
                    responsive: true,
                  }}
                />
              </CCardBody>
            </CCard>

            {/* Modal para agregar un producto a la orden */}
            <CModal
              alignment='top'
              visible={mostrarModalAgregar}
              onClose={() => {
                setMostrarModalAgregar(false);
              }}
            >
              <CModalHeader>
                <CModalTitle>
                  Agregar Producto - Orden{' '}
                  {ordenesCompra[IndexOrdenSeleccionada].number}
                </CModalTitle>
              </CModalHeader>
              <CForm onSubmit={agregarProducto}>
                <CModalBody>
                  {/* Campo sku*/}
                  <CRow>
                    <CCol sm={12} className='mb-3'>
                      <CFormLabel>SKU:</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilKey} />
                        </CInputGroupText>
                        <CFormInput name='sku' placeholder='SKU...' required />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  {/* Campo nombre*/}
                  <CRow>
                    <CCol sm={12} className='mb-3'>
                      <CFormLabel>Nombre:</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilTag} />
                        </CInputGroupText>
                        <CFormInput
                          name='name'
                          placeholder='Nombre...'
                          required
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  {/* Campo cantidad*/}
                  <CRow>
                    <CCol sm={12} className='mb-3'>
                      <CFormLabel>Cantidad:</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilBox} />
                        </CInputGroupText>
                        <CFormInput
                          type='number'
                          name='quantity'
                          placeholder='Cantidad...'
                          required
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  {/* Campo precio*/}
                  <CRow>
                    <CCol sm={12} className='mb-3'>
                      <CFormLabel>Precio:</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilDollar} />
                        </CInputGroupText>
                        <CFormInput
                          type='number'
                          name='price'
                          step='0.01'
                          placeholder='Precio...'
                          required
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>
                </CModalBody>
                <CModalFooter>
                  <CButton type='submit' className='text-white' color='success'>
                    <CIcon icon={cilSave} /> Agregar
                  </CButton>
                  <CButton
                    color='danger'
                    className='text-white'
                    onClick={() => {
                      setMostrarModalAgregar(false);
                    }}
                  >
                    <CIcon icon={cilX} /> Cerrar
                  </CButton>
                </CModalFooter>
              </CForm>
            </CModal>

            {/* Modal para confirmar el pago */}
            <CModal
              alignment='top'
              visible={mostrarModalPago}
              onClose={() => {
                setMostrarModalAgregar(false);
              }}
            >
              <CModalHeader>
                <CModalTitle>Pago exitoso</CModalTitle>
              </CModalHeader>
              <CModalBody className='text-center'>
                {/* Imagen */}
                <CImage className='mb-2' src={CheckImage} width='110' />
                <br />
                {/* Titulo */}
                <h5>
                  Pago realizado para la orden{' '}
                  {ordenesCompra[IndexOrdenSeleccionada].number}
                </h5>
                {/* Mensaje */}
                <p>
                  El pago procedió exitosamente para la orden{' '}
                  <b>{ordenesCompra[IndexOrdenSeleccionada].number}</b> , para
                  mayor información puede consultar el detalle de la orden
                  mediante el botón "Detalles".
                </p>
              </CModalBody>
              <CModalFooter>
                <CButton
                  color='success'
                  className='text-white m-auto'
                  onClick={() => {
                    setMostrarModalPago(false);
                  }}
                >
                  <CIcon icon={cilCheckCircle} /> Entendido
                </CButton>
              </CModalFooter>
            </CModal>
          </>
        )}
      </CCol>
    </CRow>
  );
}

export default App;
