import MobileSidebar from '../nav/MobileSidebar';
import CreateBoard from './CreateBoard';
import CreateTask from './CreateTask';
import DeleteBoard from './DeleteBoard';
import DeleteTask from './DeleteTask';
import ViewTask from './ViewTask';

function DialogContainer() {
  return (
    <>
      <CreateBoard />
      <CreateTask />
      <ViewTask />
      <MobileSidebar />
      <DeleteTask />
      <DeleteBoard />
    </>
  );
}

export default DialogContainer;
