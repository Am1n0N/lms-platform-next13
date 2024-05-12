"use client"
import React, { useEffect, useState } from 'react';
import { useAuth } from "@clerk/nextjs";
import { useForm } from 'react-hook-form';
import moment from 'moment';

const CommentComponent = ({ courseId }) => {
    const { userId } = useAuth();
    const { register, handleSubmit, reset } = useForm();
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);

    const fetchComments = async () => {
        const response = await fetch(`/api/comments?courseId=${courseId}`);
        const data = await response.json();
        setComments(data);
    };

    const fetchUsers = async () => {
        const response = await fetch(`/api/users`);
        const data = await response.json();
        setUsers(data);
    };

    const onSubmit = async (data) => {
        await fetch(`/api/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                text: data.text,
                courseId: courseId,
            }),
        });
        // Refetch comments after submitting
        fetchComments();
    };

    const onDelete = async (commentId) => {
        await fetch(`/api/comments`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: commentId,
            }),
        });
        // Refetch comments after deleting
        fetchComments();
    };

    useEffect(() => {
        fetchComments();
        fetchUsers();
    }, [courseId]);

    return (
        <div className="md:pl-80 pt-[80px] h-full">
            <div className="flex justify-between items-center mb-6 m-2">
                <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Discussion ({comments.length})</h2>
            </div>
            {userId && (
                <form onSubmit={handleSubmit(onSubmit)} className="mb-6 mx-2">
                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <textarea
                            {...register('text', { required: true })}
                            placeholder="Write a comment..."
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-blue-200  hover:bg-blue-800"
                    >
                        Post comment
                    </button>
                </form>
            )}

            {comments.map((comment) => (
                <div key={comment.id} className="p-6 text-base bg-white rounded-lg dark:bg-gray-900 shadow-md m-2">
                    <footer className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                            <img
                                src={users.find((user) => user.id === comment.userId)?.profileImageUrl}
                                alt={
                                    users.find((user) => user.id === comment.userId)?.firstName
                                }
                                className="mr-2 w-6 h-6 rounded-full"
                            />
                            <p className="inline-flex items-center mr-3 text-sm text-black  font-semibold">
                                {
                                    users.find((user) => user.id === comment.userId)?.firstName
                                }
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {moment(comment.createdAt).format('MMM D, YYYY')}
                            </p>
                        </div>
                        {/* Dropdown menu for comment settings */}
                        {userId === comment.userId && (
                            <button
                                className="text-red-600 hover:text-gray-600  text-xs font-medium"
                                onClick={() => onDelete(comment.id)}
                            >
                                Delete
                            </button>
                        )}
                    </footer>
                    <p className="text-gray-500 dark:text-gray-400">{comment.text}</p>
                </div>
            ))}
        </div>
    );
};

export default CommentComponent;
