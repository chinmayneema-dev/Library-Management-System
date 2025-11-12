import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const PageHeader = ({ title, subtitle, action }) => (
  <Box
    sx={{
      background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(14,165,233,0.12))',
      borderRadius: 4,
      p: { xs: 3, md: 4 },
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: { xs: 'flex-start', md: 'center' },
      justifyContent: 'space-between',
      gap: 2,
      boxShadow: '0px 18px 40px rgba(79, 70, 229, 0.12)',
      border: '1px solid rgba(99,102,241,0.15)',
    }}
  >
    <Box>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      ) : null}
    </Box>
    {action || null}
  </Box>
);

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
};

PageHeader.defaultProps = {
  subtitle: undefined,
  action: null,
};

export default PageHeader;

