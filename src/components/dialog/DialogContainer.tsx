import MobileSidebar from '../nav/MobileSidebar';
import CreateBoard from './CreateBoard';
import CreateTask from './CreateTask';
import ViewTask from './ViewTask';

function DialogContainer() {
  return (
    <>
      <CreateBoard />
      <CreateTask />
      <ViewTask />
      <MobileSidebar />
    </>
  );
}

export default DialogContainer;
