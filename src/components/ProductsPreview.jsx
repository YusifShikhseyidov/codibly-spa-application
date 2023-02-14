import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { handleDataFetch } from '../redux/productsSlice';
import axios from 'axios';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Alert, AlertTitle, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const styleForModal={
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const styleForTextField={
  display: 'flex',
  justifyContent: 'center',
  marginLeft: '50px'
}

const api = 'https://reqres.in/api/products';

export default function ProductsPreview(){
  const [currentItem, setCurrentItem] = useState(-1); //the item in the modal window
  const [search, setSearch] = useState(0); //the id value in the search bar
  const [navigation, setNavigation] = useState(1);
  const [modal, setModal] = useState(false); //to open and close the modal window
  const [warning, setWarning] = useState({open: false, message: ''});

  const {prodID} = useParams(); //get spesific item's id

  const products = useSelector(store => store.products);
  const dispatch = useDispatch();

  
  
  const fetchData = useCallback( async (searchID) => {
    try{
      let id='0';
      if(searchID){
        id = searchID.toString();
      } else if(!searchID && prodID && typeof Number(prodID) === 'number'){
        id = prodID;
      }
  
      const prod = await axios.get( id !== '0' ? `${api}/${Number(id)}` : `${api}?page=${navigation}&per_page=5`);
  
      if(id === '0'){
        dispatch(handleDataFetch(prod.data.data));
      }else {
        dispatch(handleDataFetch([prod.data.data]));
      }

    } catch(e){
      if(e.message === 'Request failed with status code 404'){
        setWarning({open: true, message: `No such item with the Id of ${searchID}`});
      } else if(e.message === 'timeout of 4000ms exceeded'){
        setWarning({open: true, message: 'Page Not Found or Could Not Be Loaded, Refresh the page or Go Home Page'});
      } else {
        setWarning({open: true, message: e.message});
      }
    }
  }, [dispatch, prodID, navigation]);

  useEffect(()=>{
    fetchData();
  }, [fetchData]);


  const itemIdInModal = (id, negativeNum=0)=>{
    setCurrentItem(id-negativeNum);
    setModal(true);
  };

  const pageSwitch = (n) =>{
    setNavigation((navi) => navi + n);
  };

  const modalClose = () => {
    setModal(false);
    setCurrentItem(-1);
  };

  const filterSearch = (e) =>{
    const id = Number(e.target.value) > 0 ? Number(e.target.value) : Number(0);
    setSearch(id);
    fetchData(id);
  };

  return (
    <>
      {warning.open && (
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setWarning({ open: false, message: '' });
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          severity="error"
          sx={{ mb: 2 }}
        >
          <AlertTitle>Error</AlertTitle>
          {warning.message}
        </Alert>
      )}

      <Modal
        open={modal}
        onClose={() => modalClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleForModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            All item data:
          </Typography>
          {products && products.length > 0 && currentItem > -1 && (
            <>
              <Typography sx={{ mt: 2 }}>
                Id: {products[currentItem].id}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Color: {products[currentItem].color}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Name: {products[currentItem].name}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Pantone value: {products[currentItem].pantone_value}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Year: {products[currentItem].year}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
      
      <div className={styleForTextField}>
        <TextField
          sx={{ mb: 1, width: 0.34 }}
          id="filled-basic"
          label="Search"
          variant="outlined"
          type="text"
          value={search || ''}
          onChange={(e) => filterSearch(e)}
        />
      </div>

      <TableContainer component={Paper} sx={{ mb: 1, width: 650 }}>
        <Table sx={{ minWidth: 300 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Year</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products && products.length > 0 && products?.map((item, id) => (
                <TableRow
                  key={item.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    bgcolor: `${item.color}`,
                  }}
                  onClick={() => itemIdInModal(id)}
                >
                  <TableCell component="th" scope="row">
                    {item.id}
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.year}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {navigation === 1 ? (
        <Button variant="text" aria-label="page_back" disabled>
          <ArrowBackIcon />
        </Button>
      ) : (
        <Button
          variant="text"
          aria-label="page_back"
          onClick={() => pageSwitch(-1)}
        >
          <ArrowBackIcon />
        </Button>
      )}
      {products.length < 5 ? (
        <Button variant="text" disabled>
          <ArrowForwardIcon />
        </Button>
      ) : (
        <Button variant="text" onClick={() => pageSwitch(1)}>
          <ArrowForwardIcon />
        </Button>
      )}
      {prodID && (
        <Button>
          <Link to="/">Go back Home</Link>
        </Button>
      )}
    </>
  );
}





// // import React, { useEffect } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { fetchProducts } from '../redux/productsSlice';

// // const Products = () => {
// //   const dispatch = useDispatch();
// //   const { data, loading, error } = useSelector((state) => state.products);

// //   useEffect(() => {
// //     dispatch(fetchProducts({ page: 1, per_page: 10, sort: 'asc' }));
// //     console.log(data)
// //   }, [dispatch, data]);

// //   if (loading) {
// //     return <div>Loading...</div>;
// //   }

// //   if (error) {
// //     return <div>{error}</div>;
// //   }

// //   return (
// //     <ul>
// //       {data.map((product) => (
// //         <li key={product.id}>{product.name}</li>
// //       ))}
// //     </ul>
// //   );
// // };

// // export default Products;


