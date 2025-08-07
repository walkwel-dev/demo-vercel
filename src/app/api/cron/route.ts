import supabase from '@/lib/supabase/serverClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("cron runnning")
    const { data: inProgressTasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'in_progress')
      .order('created_at', { ascending: true })
      .limit(1);

    let task = inProgressTasks?.[0];

    if (!task) {
      const { data: pendingTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(1);

      task = pendingTasks?.[0];

      if (task) {
        await supabase
          .from('tasks')
          .update({ status: 'in_progress' })
          .eq('id', task.id);
      }
    }

    if (!task) {
      return NextResponse.json({ message: 'No tasks to process.' });
    }

    const { data: subtasks } = await supabase
      .from('subtasks')
      .select('*')
      .eq('task_id', task.id)
      .eq('status', 'pending')
        .order('created_at', { ascending: true })
      .limit(1);

    const subtask = subtasks?.[0];

    if (!subtask) {
      await supabase
        .from('tasks')
        .update({ status: 'done' })
        .eq('id', task.id);

      return NextResponse.json({ message: `Task ${task.id} completed.` });
    }

    const dummyResponse = { message: 'Subtask simulated successfully' };

    await supabase
      .from('subtasks')
      .update({
        status: 'done',
        response: dummyResponse
      })
      .eq('id', subtask.id);

    const currentActionNumber = parseInt(subtask.action.split('-')[1] || '1', 10);

    if (currentActionNumber < 5) {
      const nextAction = `action-${currentActionNumber + 1}`;
      const dummyPayload = { step: nextAction, info: 'Simulated data' };

      await supabase
        .from('subtasks')
        .insert({
          task_id: task.id,
          action: nextAction,
          status: 'pending',
          payload: dummyPayload,
          parent_id: subtask.id
        });
    }

    return NextResponse.json({
      message: `Subtask ${subtask.id} processed.`,
      createdNext: currentActionNumber < 5
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
