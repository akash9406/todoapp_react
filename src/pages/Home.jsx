import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context, server } from "../main";
import toast from "react-hot-toast";
import TodoItem from "../components/TodoItem";
import { Navigate } from "react-router-dom";

const Home = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  const { isAuthenticated } = useContext(Context);

  const updateHandler = async (id) => {
    try {
      const { data } = await axios.put(
        `${server}/task/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/task/${id}`, {
        withCredentials: true,
      });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${server}/task/new`,
        {
          title,
          description,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTitle("");
      setDescription("");
      toast.success(data.message);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get(`${server}/task/my`, {
        withCredentials: true,
      })
      .then((res) => {
        setTasks(res.data.task);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  }, [tasks]);

  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <div className="container">
      <div className="login">
        <section>
          <form onSubmit={submitHandler}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              required
              placeholder="Title"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              required
              placeholder="description"
            />
            <button disabled={loading} type="submit">
              Add task
            </button>
          </form>
        </section>
      </div>
      <section className="todosContainer">
        {tasks.map((i) => (
          <TodoItem
            key={i._id}
            title={i.title}
            description={i.description}
            isCompleted={i.isCompleted}
            updateHandler={updateHandler}
            deleteHandler={deleteHandler}
            id={i._id}
          />
        ))}
      </section>
    </div>
  );
};

export default Home;
