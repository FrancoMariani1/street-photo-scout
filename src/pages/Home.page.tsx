import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import { useSelector } from 'react-redux';
import { increment, decrement, fetchCount } from '../slices/counterSlice';
import { RootState, useAppDispatch } from '../store/store';
import { Button, Group, Stack, Title } from '@mantine/core';

export function HomePage() {
  const dispatch = useAppDispatch();
  const count = useSelector((state: RootState) => state.counter.value);
  const status = useSelector((state: RootState) => state.counter.status);

  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <Stack align='center' pt='lg'>
        <Title>Count: {count}</Title>
        <Group>
          <Button onClick={() => dispatch(increment())}>Increment</Button>
          <Button onClick={() => dispatch(decrement())}>Decrement</Button>
          <Button onClick={() => dispatch(fetchCount(5))}>Fetch Count</Button>
          {status === 'loading' && <p>Loading...</p>}
        </Group>
      </Stack>
    </>
  );
}
