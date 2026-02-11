import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Page not found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" component={Link} to="/users">
        Go to Users
      </Button>
    </Box>
  );
}
