// imports remain unchanged
function LoginPage() {
  // state and handlers remain unchanged

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card
        elevation={3}
        sx={{
          background: 'linear-gradient(to bottom, #f3c13a, #d6a90b 60%, #b8860b)',
          color: 'black',
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          {message && <Alert severity="error">{message}</Alert>}
          <Stack component="form" spacing={2} onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              // Make the input field black with white text
              sx={{ '& .MuiInputBase-input': { bgcolor: '#000', color: '#fff' } }}
              InputLabelProps={{ sx: { color: '#000' } }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiInputBase-input': { bgcolor: '#000', color: '#fff' } }}
              InputLabelProps={{ sx: { color: '#000' } }}
            />
            <Button variant="contained" type="submit">
              Login
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

export default LoginPage;
