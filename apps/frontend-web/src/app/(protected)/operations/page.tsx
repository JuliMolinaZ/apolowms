"use client";

import Link from "next/link";
import { Box, Grid, CardActionArea, Card, CardContent, Typography } from "@mui/material";

export default function OperationsIndexPage() {
  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Operations
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Link href="/operations/picking" passHref>
            <CardActionArea component="a">
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">Picking</Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Link>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Link href="/operations/packing" passHref>
            <CardActionArea component="a">
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">Packing</Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Link>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Link href="/operations/putaway" passHref>
            <CardActionArea component="a">
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">Putaway</Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}
