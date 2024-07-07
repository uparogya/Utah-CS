import React from 'react';
import ArticleIcon from '@mui/icons-material/Article'

const Footer = () => (
  <footer style={{ backgroundColor: '#003789', padding: '4px', color: 'whitesmoke', textAlign: 'center', fontSize: 'smaller' }}>
      <p style={{padding: '0 10%'}}>This work is funded in part by a co-sponsorship from the Expanding Computing Education Pathways (ECEP) Alliance <a style={{color: 'whitesmoke'}} href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=2137834&HistoricalAwards=false" target='_blank'>(NSF-CNS-2137834)</a>, an NSF-funded Broadening Participation in Computing Alliance.</p>
      <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <a href="https://files.eric.ed.gov/fulltext/ED604662.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'whitesmoke'}}>
          <ArticleIcon style={{ verticalAlign: 'text-bottom' }} fontSize="small" /> 2019 Utah CS Landscape Report
        </a>
        <a href="https://drive.google.com/drive/folders/1s7HDlOPJdgttVf39jmB4OwiipTal5jht" target="_blank" rel="noopener noreferrer" style={{ color: 'whitesmoke'}}>
          <ArticleIcon style={{ verticalAlign: 'text-bottom' }} fontSize="small" /> Infographics From Funded LEAs
        </a>
      </div> 
    <br></br>
  </footer>
);

export default Footer;