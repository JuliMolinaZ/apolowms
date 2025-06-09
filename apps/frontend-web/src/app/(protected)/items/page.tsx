"use client";

import Link from "next/link";
import { Box, Grid, CardActionArea, Card, CardContent, Typography } from "@mui/material";

export default function ItemsIndexPage() {
  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Items
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Link href="/items/mobilizations" passHref>
            <CardActionArea component="a">
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">Movilizaciones</Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}
