import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Autocomplete, TextField } from '@mui/material'
import { FormEvent, SyntheticEvent, useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'

type Option = {
  label: string;
  value: string;
}

const Home: NextPage = () => {
  const [version, setVersion] = useState("");
  const [champions, setChampions] = useState([]);
  const [selected, setSelected] = useState({ label: "", value: "" });

  useEffect(() => {
    axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
      .then(res => res.data[0])
      .then(setVersion);
  }, []);

  useEffect(() => {
    if (version !== "") {
      axios.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`)
        .then((res) => 
          Object.values(res.data.data)
          // @ts-ignore
                .map(({name}: {name: string}) => ({ label: name, value: encodeURIComponent(name)})))
          // @ts-ignore
        .then(setChampions);
    }
  }, [version]);

  useEffect(() => {
    if (selected.value !== "") {
      window.open(`https://leagueoflegends.fandom.com/wiki/${selected.value}/LoL`)
    }
  }, [selected]);

  function handleChange(event: SyntheticEvent, a: Option | null) {
    setSelected(a ?? { label: "", value: "" })
  }

  return (
    <div style={{ padding: "4rem" }}>
      <Autocomplete
        disablePortal
        options={champions}
        selectOnFocus
        autoHighlight
        openOnFocus
        // sx={{width: 200}}
        value={selected}
        onChange={handleChange}
        renderInput={(params) => <TextField autoFocus {...params} label="Champion" />} />
    </div>
  )
}

export default Home
