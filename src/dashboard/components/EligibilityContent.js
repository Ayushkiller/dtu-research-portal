import React from 'react';
import { Paper, Box, Typography, Divider } from '@mui/material';

export default function EligibilityContent() {
  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      m: 0,
      p: 0
    }}>
      <Paper 
        elevation={2}
        sx={{ 
          flex: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          minHeight: '100%',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 64px)',
          borderRadius: 0,
          m: 0,
          '& h2': {
            color: 'primary.main',
            fontSize: { xs: '1.5rem', md: '1.75rem' },
            mb: 2,
            mt: 3,
            '&:first-of-type': {
              mt: 0
            }
          },
          '& h3': {
            color: 'text.primary',
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            mb: 2,
            mt: 3
          },
          '& h4': {
            color: 'text.secondary',
            fontSize: { xs: '1.1rem', md: '1.25rem' },
            mb: 2
          },
          '& p': {
            color: 'text.secondary',
            mb: 2,
            lineHeight: 1.7
          },
          '& ul': {
            pl: 3,
            mb: 3,
            '& li': {
              mb: 1,
              color: 'text.secondary',
              '& strong': {
                color: 'text.primary',
                fontWeight: 600
              }
            },
            '& ul': {
              mt: 1
            }
          }
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 4, color: 'primary.main', fontWeight: 'bold' }}>
          Research Awards & Eligibility Criteria
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <Typography variant="h5" component="h2">Eligibility</Typography>
        <ul>
          <li><strong>First Author/Corresponding Author:</strong> Only the first author or corresponding author of a publication is eligible to apply for the award. [cite: 4, 16, 17]</li>
          <li><strong>SCI/SSCI/SCI Expanded:</strong> Publications must be listed in the Science Citation Index (SCI), Social Science Citation Index (SSCI), or SCI expanded. [cite: 3, 22, 24, 27]</li>
          <li><strong>Publication Period:</strong> Papers must be published within the specified year (January 1st to December 31st) and have a Digital Object Identifier (DOI), pagination, and year of publication. [cite: 4, 6]</li>
          <li><strong>No Publication Fee:</strong> Papers published in journals that require a publication fee (article processing charges or open access charges) are not eligible for cash awards. [cite: 4]</li>
          <li><strong>Author Contribution:</strong> All authors must have made significant intellectual contributions to the paper; those with no contribution disqualify the paper. [cite: 11, 12, 13, 15]</li>
        </ul>
        <Typography variant="h5" component="h2">Cash Rewards</Typography>
        <ul>
          <li><strong>Outstanding Research Awards:</strong> Rs. 5,00,000 for papers with an impact factor of at least two, published in select journals (Nature Journal, Science, Harvard Business Review). [cite: 20, 21, 22]</li>
          <li><strong>Premier Research Awards:</strong> Rs. 1,00,000 for papers with an impact factor of at least 3.0 (for IEEE Transactions) or 1.0 (for other journals), published in select journals. [cite: 20, 23, 24]</li>
          <li><strong>Commendable Research Awards:</strong> Rs. 50,000 for papers with an impact factor of at least one, published in select journals. [cite: 20, 26, 27]</li>
        </ul>
        <Typography variant="h5" component="h2">Guidelines for the Award for Published Paper of the Researchers of Delhi Technological University</Typography>
        <p>The cash awards will be given to researchers in recognition of the importance of the published research work and to motivate individual excellence in research. The publications considered must be listed in Science Citation Index (SCI) or SCI expanded. The awards will be granted for the journal papers published in each year (1st January - 31st December, published along with Digital Object Identifier (DOI), pagination and year of publication). Only the first author and/or the corresponding author shall be eligible to apply for the award. A notice will be circulated annually and the entry form consisting of published research papers qualifying the selection criteria will be submitted to the concerned section. Publications in journals that require a publication fee (article processing charges or open access charges) shall not be considered for cash awards (irrespective of listing in the publication societies/houses/presses specified in the following lists). If one or more authors are found with zero contribution, the paper shall not be considered for the award.</p>
        <Typography variant="h6" component="h3">Definitions:</Typography>
        <ul>
          <li><strong>University:</strong> Delhi Technological University (DTU), Delhi.</li>
          <li><strong>Paper:</strong> Any publication appearing in a journal entitled "......" excluding letters to the editor and editorials. The publication must be electronically available online with a Digital Object Identifier (DOI).</li>
          <li><strong>Faculty Member of the University:</strong> An individual who is a regular faculty member of the University.</li>
          <li><strong>University Student:</strong> An individual who is registered for any degree in the Delhi Technological University.</li>
          <li><strong>Researcher:</strong> An individual who is either a faculty member of the university or a student involved in research.</li>
          <li><strong>Author:</strong> An individual who conforms to all of the following criteria:
            <ul>
              <li>Made a significant intellectual contribution to the theoretical development, system, or experimental design, prototype development, and/or the analysis and interpretation of data associated with the work contained in the article;</li>
              <li>Contributed to drafting the article or reviewing and/or revising it for intellectual content;</li>
              <li>Approved the final version of the article as accepted for publication, including references.</li>
              <li>Contributors who do not meet all of the above criteria (a to c) may be present in the acknowledgment section of the article.</li>
              <li>Omitting an author who contributed to the article or including a person who did not fulfill all of the above requirements is considered a breach of publishing ethics.</li>
            </ul>
          </li>
          <li><strong>First Author:</strong> An individual who is either a faculty member of the university or a university student and whose name appears first in the list of authors on the title page of the paper.</li>
          <li><strong>Corresponding Author:</strong> An individual who is either a faculty member of the university or a university student and whose name appears first in the list of corresponding authors on the title page of the paper. As proof of corresponding author status, the researcher must provide a screenshot of the tool box of the paper submission system (e.g., Editorial Manager/Scholar One) where the author's name appears on the login page and the title of the claimed paper is listed. If there is more than one corresponding author, the author whose name appears first on the paper submission system shall be treated as the corresponding author for the purpose of the award.</li>
        </ul>
        <Typography variant="h6" component="h3">Award Categories & Selection Criteria:</Typography>
        <Typography variant="subtitle1" component="h4">Outstanding Research Awards</Typography>
        <p>A cash prize of Rs. 5,00,000/- will be awarded along with a certificate of merit.</p>
        <p><strong>Selection Criteria:</strong> The paper must be a Science Citation Index (SCI)/Social Science Citation Index (SSCI)/SCI expanded journal paper with an impact factor of at least two, and published in the following:</p>
        <ul>
          <li>Nature</li>
          <li>Science</li>
          <li>Harvard Business Review</li>
        </ul>
        <Typography variant="subtitle1" component="h4">Premier Research Awards</Typography>
        <p>A cash prize of Rs. 1,00,000/- will be awarded along with a certificate of merit.</p>
        <p><strong>Selection Criteria:</strong> The paper must be a journal paper with an impact factor of at least 3.0 for Institute of Electrical and Electronics Engineers (IEEE) Transactions and for all others indexed in SCI/SSCI or SCI expanded and published in the following:</p>
        <ul>
          <li>Proceedings of the Royal Society</li>
          <li>American Mathematical Society</li>
          <li>American Physical Society</li>
          <li>American Society of Civil Engineers (ASCE)</li>
          <li>American Society of Mechanical Engineers (ASME)</li>
          <li>IEEE Transactions (Impact Factor ≥ 3.0)</li>
          <li>Association for Computing Machinery (ACM) Transactions</li>
          <li>Institute of Civil Engineering Publishing, London</li>
          <li>Institute of Mechanical Engineering, London</li>
          <li>American Society for Testing Materials (ASTM)</li>
          <li>Nature Publishing Group</li>
        </ul>
        <p>In addition to the above list, journals with an impact factor equal to or more than thirty (30) will also be considered for the award.</p>
        <Typography variant="subtitle1" component="h4">Commendable Research Awards</Typography>
        <p>A cash prize of Rs. 50,000/- will be awarded along with a certificate of merit.</p>
        <p><strong>Selection Criteria:</strong> The paper must be a journal paper with an impact factor of at least one, indexed in SCI/SSCI or SCI expanded and published in the following:</p>
        <ul>
          <li>IEEE Transactions (Impact Factor &lt; 3)</li>
          <li>IEEE Journals</li>
          <li>Springer</li>
          <li>Elsevier (Science Direct)</li>
          <li>Oxford University Press</li>
          <li>Pergamon-Elsevier Science Ltd</li>
          <li>Cambridge University Press</li>
          <li>Wiley-Blackwell</li>
          <li>Blackwell Publishing</li>
          <li>John Wiley & Sons</li>
          <li>Institute of Engineering and Technology (IET)</li>
          <li>Biomedical Central Ltd</li>
          <li>Massachusetts Institute of Technology (MIT) Press</li>
          <li>Indiana University Press</li>
          <li>American Meteorological Society</li>
          <li>American Physiological Society</li>
          <li>American Society for Microbiology</li>
          <li>American Chemical Society</li>
          <li>American Institute of Physics</li>
          <li>Institute of Physics (IOP) Publishing Ltd.</li>
          <li>Massachusetts Medical Society</li>
          <li>IOS Press</li>
          <li>Princeton University Press</li>
          <li>Society of Industrial and Applied Mathematics</li>
          <li>Proceedings of the National Academy of Sciences of USA</li>
        </ul>
        <p>In the commendable award category, an author shall be eligible for the cash prize for not more than three papers; however, all university authors of all papers shall be eligible for the certificate.</p>
        <p>In addition to the above list, SCI/SSCI and SCI expanded indexed journals not included in the above list but having an impact factor equal to or more than five shall also be considered for the award.</p>
        <Typography variant="h6" component="h3">Regulations for Division & Distribution of Award Prize</Typography>
        <ul>
          <li><strong>Case 1:</strong> If all the authors are faculty members of the university, then the first author will decide the individual author's contribution for the purpose of distribution of the prize amount.</li>
          <li><strong>Case 2:</strong> If the authors are faculty members of the university and university students, then the faculty member of the university (whose name appears first in the paper) will decide the individual author's contribution for the purpose of distribution of the prize amount.</li>
          <li><strong>Case 3:</strong> If the first author, corresponding author, and other authors are university students, then the Head of the Department of the first/corresponding student's department (whose name appears first in the paper) will decide the individual author's contribution in consultation with the first author for the purpose of distribution of the prize amount.</li>
          <li><strong>Case 4:</strong> If one (or more) of the authors is/are external to the university, then the prize amount will be divided by the total number of authors, and the equal part (one share) of the total prize amount will be disbursed to the university contributors. The prize amount of the external author will be subtracted from the total prize amount.</li>
          <li><strong>Case 5:</strong> A faculty member of the university or a university student shall be permitted to claim a cash prize for a maximum of three papers as author or co-author in the category of commendable research award.</li>
        </ul>
        <p>Annexure 1 will be referred to for evaluating the research papers for granting the award to the researchers of DTU, and Annexure 2 will be referred to for the calculation of the cash prize for distribution amongst researchers/authors of DTU.</p>
        <p><strong>Power to remove difficulties:</strong> If any difficulty arises in giving effect to the provisions of these guidelines, the Vice Chancellor may make such provisions, not inconsistent with the provisions in these guidelines, as appear to be necessary or expedient for removing the difficulty.</p>
        <p>The guidelines shall be implemented for the period of 1st January to 31st December of the respective calendar year.</p>
      </Paper>
    </Box>
  );
}
