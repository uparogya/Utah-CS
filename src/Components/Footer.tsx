import React from 'react';
import ArticleIcon from '@mui/icons-material/Article'

const Footer = () => (
  <footer style={{ backgroundColor: '#003789', padding: '4px', color: 'white', textAlign: 'center' }}>
    <div style={{ margin: '0 auto' }}>
      <h4>External Links:</h4>
      <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <a href="https://docs.google.com/spreadsheets/d/1vjRWlFjWpiI3693YyfJjWGzG95QnKhzD3JTz2yuprtc/edit#gid=0" target="_blank" rel="noopener noreferrer" style={{ color: 'white'}}>
          <ArticleIcon style={{ verticalAlign: 'text-bottom' }} fontSize="small" /> Course Description
        </a>
        <a href="https://drive.google.com/drive/folders/1s7HDlOPJdgttVf39jmB4OwiipTal5jht" target="_blank" rel="noopener noreferrer" style={{ color: 'white'}}>
          <ArticleIcon style={{ verticalAlign: 'text-bottom' }} fontSize="small" /> Infographics From Funded LEAs
        </a>
        <a href="https://files.eric.ed.gov/fulltext/ED604662.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'white'}}>
          <ArticleIcon style={{ verticalAlign: 'text-bottom' }} fontSize="small" /> 2019 Utah CS Landscape Report
        </a>
      </div> 
      <h4>Acknowledgement:</h4>
    </div>
    <br></br>
  </footer>
);

export default Footer;